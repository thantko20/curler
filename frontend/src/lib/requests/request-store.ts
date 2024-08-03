import { writable } from "svelte/store"
import { nanoid } from "nanoid"
import type { Pairs, RequestItem } from "../types"
import { extractPathParams } from "../internals/extract-path-params"

export type InitialRequestItem = Omit<RequestItem, "requestId">

const defaultInitialState: InitialRequestItem = {
	url: "https://dummyjson.com/product",
	method: "GET",
	headers: [],
	body: undefined,
	pathParams: [],
	queryParams: []
}

export const createRequestItem = (data: InitialRequestItem): RequestItem => {
	return {
		url: data.url,
		method: data.method,
		headers: data.headers,
		body: data.body,
		queryParams: [],
		pathParams: [],
		requestId: nanoid()
	}
}

export const createRequestStore = (initialState = defaultInitialState) => {
	const { set, subscribe, update } = writable(createRequestItem(initialState))

	const handlePairsChange = (pairs: Pairs, pair: Pairs[number], index: number) => {
		let result = [...pairs]
		const { key, value } = pair
		if (!key && !value) {
			result = result.filter((_, i) => i !== index)
		} else if (index === result.length) {
			result.push(pair)
		} else if (result[index]) {
			result[index] = pair
		}
		return result
	}

	return {
		subscribe,
		set,
		update,
		onUrlChange(newUrl: string) {
			update((state) => {
				state.url = newUrl
				// state.pathParams = concilePathParamsWithUrl(newUrl, state.pathParams)
				// state.queryParams = extractQueryParams(newUrl)
				return state
			})
		},
		onHeadersChange(pair: Pairs[number], index: number) {
			update((state) => {
				state.headers = handlePairsChange(state.headers, pair, index)
				return state
			})
		},
		onQueryParamsChange(pair: Pairs[number], index: number) {
			update((state) => {
				state.queryParams = handlePairsChange(state.queryParams, pair, index)
				return state
			})
		},
		onBodyChange(body: any) {
			update((state) => {
				state.body = body
				return state
			})
		}
	}
}

export default createRequestStore()

function isKeyInPairs(key: string, pairs: Pairs) {
	return pairs.some((pair) => pair.key === key)
}

function concilePathParamsWithUrl(url: string, originalPathParams: Pairs): Pairs {
	let result = [...originalPathParams]
	const pathParamsFromUrl = extractPathParams(url)
	const pps = result.filter((opp) => pathParamsFromUrl.includes(opp.key))
	result = pps
	pathParamsFromUrl.forEach((p) => {
		if (isKeyInPairs(p, pps)) {
			return
		}
		result.push({
			key: p,
			value: ""
		})
	})
	return result
}
