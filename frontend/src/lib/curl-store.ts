import { writable } from "svelte/store"
import type { HttpMethod } from "./types"

const DEFAULT_URL = "https://dummyjson.com/product"

export type CurlStore = {
	url: string
	method: HttpMethod | null
	headers: Record<string, string>
	body: any
	queryParamPairs: Array<[string, string]>
	pathVariables: Record<string, string>
}

function createCurlStore() {
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

	function extractPathParams(url: string) {
		const splitted = url.split("?")
		const path = splitted[0] ?? ""
		const pathParams = path.split("/").filter((p) => p.startsWith(":") && p.length > 1)
		return pathParams
	}

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
			})
	}
}

export default createCurlStore()
