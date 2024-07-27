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
})
