import { describe, it, expect } from "vitest"
import { replacePathParams } from "./replace-path-params"

describe("replace path params", () => {
	it("replaces a single param", function () {
		const url = "https://dummyjson.com/product/:id"
		const pathParams = [{ key: "id", value: "1" }]
		const expected = "https://dummyjson.com/product/1"

		expect(replacePathParams(url, pathParams)).toBe(expected)
	})

	it("replaces multiple params", function () {
		const url = "https://dummyjson.com/product/:id/user/:userId"
		const pathParams = [
			{ key: "id", value: "1" },
			{ key: "userId", value: "2" }
		]
		const expected = "https://dummyjson.com/product/1/user/2"

		expect(replacePathParams(url, pathParams)).toBe(expected)
	})
})
