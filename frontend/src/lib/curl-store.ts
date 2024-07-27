import { get, writable } from "svelte/store"
import type { HttpMethod } from "./types"
import { extractPathParams } from "./extract-path-params"

const DEFAULT_URL = "https://dummyjson.com/product"

type Pairs = Array<[string, string]>

type RequestItem = {
	url: string
	method: HttpMethod | null
	headers: Pairs
	body: unknown
	queryParamPairs: Pairs
	pathVariables: Pairs
	// pathVariables: Record<string, string>
}

export type CurlStore = {
	url: string
	method: HttpMethod | null
	headers: Record<string, string>
	body: any
	queryParamPairs: Array<[string, string]>
	pathVariables: Record<string, string>
}

export function createCurlStore() {
	const { set, subscribe, update } = writable<CurlStore>({
		body: undefined,
		headers: {},
		method: null,
		url: DEFAULT_URL,
		queryParamPairs: [["", ""]],
		pathVariables: {}
	})

	subscribe((state) => {
		const splitted = state.url.split("?")
		const search = splitted[1] ?? ""
		state.queryParamPairs = Array.from(new URLSearchParams(search).entries()).map(
			([key, value]) => [key, value]
		)
		const pathParams = extractPathParams(state.url)

		pathParams.forEach((p) => {
			if (p in state.pathVariables) return
			state.pathVariables[p] = ""
		})

		Object.keys(state.pathVariables).forEach((p) => {
			if (!pathParams.includes(p)) {
				delete state.pathVariables[p]
			}
		})
	})

	return {
		subscribe,
		set,
		onParamsInputChange: (pair: [string, string], index: number) =>
			update((state) => {
				const [key, value] = pair
				if (!value && !key) {
					state.queryParamPairs = state.queryParamPairs.filter((_, i) => i !== index)
				}

				state.queryParamPairs[index] = [key, value]

				state.queryParamPairs = state.queryParamPairs.filter(([k, v]) => k || v)

				const searchParams = new URLSearchParams(state.queryParamPairs)
				state.url = `${state.url.split("?")[0] ?? ""}?${searchParams.toString()}`
				return state
			}),

		setPathVariable: (pair: [string, string]) =>
			update((state) => {
				const [key, value] = pair
				if (key in state.pathVariables) {
					state.pathVariables[key] = value
				}
				return state
			}),

		onHeaderEntryChange: (pair: [string, string], index: number) =>
			update((state) => {
				let headerEntries = Object.entries(state.headers)
				const [key, value] = pair
				if (!key && !value) {
					headerEntries = headerEntries.filter((_, i) => i !== index)
				} else if (headerEntries[index]) {
					headerEntries[index] = [key.replaceAll(" ", "-"), value]
				} else if (headerEntries.length === index) {
					headerEntries.push([key.trim().replaceAll(" ", "-"), value])
				}
				state.headers = Object.fromEntries(headerEntries)
				return state
			}),

		get formattedUrl() {
			const state = get(this)
			if (!state.url) return ""
			let url = state.url
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				url = `https://${url}`
			}
			const pathParams = extractPathParams(url)
			pathParams.forEach((p) => {
				if (p in state.pathVariables) {
					url = url.replace(p, state.pathVariables[p])
				}
			})

			return url
		}
	}
}

export default createCurlStore()
