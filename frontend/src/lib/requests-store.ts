import { writable } from "svelte/store"
import { nanoid } from "nanoid"
import type { Pairs, RequestItem } from "./types"
import { extractPathParams } from "./internals/extract-path-params"

export const createRequestItem = (data: Partial<RequestItem> = {}): RequestItem => {
	return {
		url: "",
		method: "",
		headers: [],
		body: undefined,
		queryParams: [],
		pathParams: [],
		requestId: nanoid(),
		...data
	}
}

export const createRequestsStore = (
	initialState: RequestItem[] = [createRequestItem({ url: "https://dummyjson.com/product" })]
) => {
	const { set, subscribe, update } = writable(initialState)

	return {
		subscribe,
		set,
		update,
		onUrlChange(requestId: string, newUrl: string) {
			update((state) => {
				const index = state.findIndex((item) => item.requestId === requestId)!
				const requestItem = state[index]
				const pathParams = extractPathParams(newUrl)

				// iterate over pathParams and check if requestItem.pathParams[index].key is in pathParams
				// if not, add a new pathParam with key and value ""
				const pps = requestItem.pathParams.filter((rpp) => pathParams.includes(rpp.key))
				state[index].pathParams = pps
				pathParams.forEach((p) => {
					if (isKeyInPairs(p, pps)) {
						return
					}
					state[index].pathParams.push({
						key: p,
						value: ""
					})
				})

				return state
			})
		}
	}
}

export default createRequestsStore()

function isKeyInPairs(key: string, pairs: Pairs) {
	return pairs.some((pair) => pair.key === key)
}
