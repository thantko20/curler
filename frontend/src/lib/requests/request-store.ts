import { writable } from "svelte/store"
import { nanoid } from "nanoid"
import type { BodyType, Pairs, RequestItem } from "../types"
import { extractPathParams } from "../internals/extract-path-params"

export type InitialRequestItem = Omit<RequestItem, "requestId">

const defaultInitialState: InitialRequestItem = {
	url: "https://dummyjson.com/product",
	method: "GET",
	headers: [],
	pathParams: [],
	queryParams: []
}

export const createRequestItem = (data: InitialRequestItem): RequestItem => {
	// @ts-ignore
	return {
		url: data.url,
		method: data.method,
		headers: data.headers,
		queryParams: [],
		pathParams: [],
		requestId: nanoid(),
		bodyType: data.bodyType,
		body: data.body
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
		},
		onFormBodyChange(pair: Pairs[number], index: number) {
			update((state) => {
				if (
					state.bodyType === "multipart/form-data" ||
					state.bodyType === "x-www-form-urlencoded"
				) {
					state.body = handlePairsChange(state.body, pair, index)
				}
				return state
			})
		},
		onBodyTypeChange(bodyType: BodyType | undefined) {
			update((state) => {
				if (!bodyType) {
					state.bodyType = undefined
					state.body = undefined
				} else if (bodyType === "text" || bodyType === "json" || bodyType === "yaml") {
					state.body = ""
				} else if (bodyType === "multipart/form-data" || bodyType === "x-www-form-urlencoded") {
					state.body = []
				} else {
					state.body = undefined
				}
				state.bodyType = bodyType
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
