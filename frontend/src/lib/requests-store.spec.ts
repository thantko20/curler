import { describe, it, expect } from "vitest"
import { createRequestItem, createRequestsStore } from "./requests-store"
import { get } from "svelte/store"

describe("requests store", function () {
	it("should add a path param correctly to request item when url has one path param", function () {
		const requestItem = createRequestItem()
		const requestsStore = createRequestsStore([requestItem])
		requestsStore.onUrlChange(requestItem.requestId, "https://dummyjson.com/product/:id")
		const state = get(requestsStore)
		expect(state[0].pathParams).toHaveLength(1)
		expect(state[0].pathParams[0].key).toBe("id")
	})

	it("should remove a certain path param when url has less path params", function () {
		const requestItem = createRequestItem({
			url: "https://dummyjson.com/product/:id",
			pathParams: [{ key: "id", value: "123" }]
		})
		const requestsStore = createRequestsStore([requestItem])
		requestsStore.onUrlChange(requestItem.requestId, "https://dummyjson.com/product")
		const state = get(requestsStore)
		expect(state[0].pathParams).toHaveLength(0)
	})

	it("should remove a certain path param when url has less path params", function () {
		const requestItem = createRequestItem({
			url: "https://dummyjson.com/product/:id/user/:userId",
			pathParams: [
				{ key: "id", value: "123" },
				{ key: "userId", value: "456" }
			]
		})
		const requestsStore = createRequestsStore([requestItem])
		requestsStore.onUrlChange(requestItem.requestId, "https://dummyjson.com/product/:id")
		const state = get(requestsStore)
		expect(state[0].pathParams).toHaveLength(1)
		expect(state[0].pathParams[0].key).toBe("id")
	})

	it("should handle query params correctly", function () {
		const requestItem = createRequestItem({
			url: "https://dummyjson.com/product"
		})
		const requestsStore = createRequestsStore([requestItem])
		requestsStore.onUrlChange(
			requestItem.requestId,
			"https://dummyjson.com/product?id=123&limit=10"
		)
		const state = get(requestsStore)
		expect(state[0].queryParams).toHaveLength(2)
		expect(state[0].queryParams[0]).toMatchObject({ key: "id", value: "123" })
		expect(state[0].queryParams[1]).toMatchObject({ key: "limit", value: "10" })
	})

	it("should handle duplicated query params correctly", function () {
		const requestItem = createRequestItem({
			url: "https://dummyjson.com/product"
		})
		const requestsStore = createRequestsStore([requestItem])
		requestsStore.onUrlChange(
			requestItem.requestId,
			"https://dummyjson.com/product?limit=15&limit=10"
		)
		const state = get(requestsStore)
		expect(state[0].queryParams).toHaveLength(2)
		expect(state[0].queryParams[0]).toMatchObject({ key: "limit", value: "15" })
		expect(state[0].queryParams[1]).toMatchObject({ key: "limit", value: "10" })
	})
})
