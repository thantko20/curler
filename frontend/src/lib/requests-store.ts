import { writable } from "svelte/store"
import { nanoid } from "nanoid"
import type { Pairs, RequestItem } from "./types"
import { extractPathParams } from "./internals/extract-path-params"
import { extractQueryParams } from "./internals/extract-query-params"

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

				const queryParams = extractQueryParams(newUrl)
				state[index].queryParams = queryParams

				return state
			})
		},
		onHeadersChange(requestId: string, pair: Pairs[number], index: number) {
			update((state) => {
				const rIndex = state.findIndex((item) => item.requestId === requestId)!
				const requestItem = state[rIndex]
				if (index === requestItem.headers.length) {
					requestItem.headers.push(pair)
				} else if (requestItem.headers[index]) {
					requestItem.headers[index] = pair
				}
				state[rIndex].headers = requestItem.headers
				return state
			})
		}
	}
}

export default createRequestsStore()

function isKeyInPairs(key: string, pairs: Pairs) {
	return pairs.some((pair) => pair.key === key)
}
