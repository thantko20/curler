import { describe, it, expect } from "vitest"
import { createRequestItem, createRequestStore, type InitialRequestItem } from "./request-store"
import { get } from "svelte/store"

const defaultInitialRequest: InitialRequestItem = {
	url: "https://dummyjson.com/product",
	method: "GET",
	headers: [],
	body: undefined,
	pathParams: [],
	queryParams: []
}

describe("request store", function () {
	// it("should add a path param correctly to request when url has one path param", function () {
	// 	const requestStore = createRequestStore(defaultInitialRequest)
	// 	requestStore.onUrlChange("https://dummyjson.com/product/:id")
	// 	const state = get(requestStore)
	// 	expect(state.pathParams).toHaveLength(1)
	// 	expect(state.pathParams[0].key).toBe("id")
	// })

	// it("should remove a certain path param when url has less path params", function () {
	// 	const initialRequestItem = createRequestItem({
	// 		...defaultInitialRequest,
	// 		url: "https://dummyjson.com/product/:id",
	// 		pathParams: [{ key: "id", value: "123" }]
	// 	})
	// 	const requestStore = createRequestStore(initialRequestItem)
	// 	requestStore.onUrlChange("https://dummyjson.com/product")
	// 	const state = get(requestStore)
	// 	expect(state.pathParams).toHaveLength(0)
	// })

	// it("should remove a certain path param when url has less path params", function () {
	// 	const requestItem = createRequestItem({
	// 		...defaultInitialRequest,
	// 		url: "https://dummyjson.com/product/:id/user/:userId",
	// 		pathParams: [
	// 			{ key: "id", value: "123" },
	// 			{ key: "userId", value: "456" }
	// 		]
	// 	})
	// 	const requestStore = createRequestStore(requestItem)
	// 	requestStore.onUrlChange("https://dummyjson.com/product/:id")
	// 	const state = get(requestStore)
	// 	expect(state.pathParams).toHaveLength(1)
	// 	expect(state.pathParams[0].key).toBe("id")
	// })

	// it("should handle query params correctly", function () {
	// 	const requestItem = createRequestItem({
	// 		...defaultInitialRequest,
	// 		url: "https://dummyjson.com/product"
	// 	})
	// 	const requestStore = createRequestStore(requestItem)
	// 	requestStore.onUrlChange("https://dummyjson.com/product?id=123&limit=10")
	// 	const state = get(requestStore)
	// 	expect(state.queryParams).toHaveLength(2)
	// 	expect(state.queryParams[0]).toMatchObject({ key: "id", value: "123" })
	// 	expect(state.queryParams[1]).toMatchObject({ key: "limit", value: "10" })
	// })

	// it("should handle duplicated query params correctly", function () {
	// 	const requestItem = createRequestItem({
	// 		...defaultInitialRequest,
	// 		url: "https://dummyjson.com/product"
	// 	})
	// 	const requestStore = createRequestStore(requestItem)
	// 	requestStore.onUrlChange("https://dummyjson.com/product?limit=15&limit=10")
	// 	const state = get(requestStore)
	// 	expect(state.queryParams).toHaveLength(2)
	// 	expect(state.queryParams[0]).toMatchObject({ key: "limit", value: "15" })
	// 	expect(state.queryParams[1]).toMatchObject({ key: "limit", value: "10" })
	// })

	it("should add a new query param if params is empty", function () {
		const requestItem = createRequestItem({
			...defaultInitialRequest,
			url: "https://dummyjson.com/product"
		})
		const requestStore = createRequestStore(requestItem)
		requestStore.onQueryParamsChange({ key: "id", value: "123" }, 0)
		const state = get(requestStore)
		expect(state.queryParams).toHaveLength(1)
		expect(state.queryParams[0]).toMatchObject({ key: "id", value: "123" })
	})

	it("should remove a certain query param when both key and value are empty in pair", function () {
		const requestItem = createRequestItem({
			...defaultInitialRequest,
			url: "https://dummyjson.com/product"
		})
		const requestStore = createRequestStore(requestItem)
		requestStore.onQueryParamsChange({ key: "id", value: "123" }, 0)
		requestStore.onQueryParamsChange({ key: "limit", value: "10" }, 1)

		requestStore.onQueryParamsChange({ key: "", value: "" }, 0)

		const state = get(requestStore)
		expect(state.queryParams).toHaveLength(1)
		expect(state.queryParams[0]).toMatchObject({ key: "limit", value: "10" })
	})
})
