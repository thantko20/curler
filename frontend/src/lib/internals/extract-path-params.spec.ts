import { describe, expect, it } from "vitest"
import { extractPathParams } from "./extract-path-params"

describe("extract path params", () => {
	it("extracts single param", function () {
		const url = "https://dummyjson.com/product/:id"
		expect(extractPathParams(url)).toEqual(["id"])
	})

	it("extracts multiple params", function () {
		const url = "https://dummyjson.com/product/:id/user/:userId"
		expect(extractPathParams(url)).toEqual(["id", "userId"])
	})

	it("returns empty array if no params are found", function () {
		const url = "https://dummyjson.com/product"
		expect(extractPathParams(url)).toEqual([])
	})

	it("handles duplicate params", function () {
		const url = "https://dummyjson.com/product/:id/user/:userId/:id"
		expect(extractPathParams(url)).toEqual(["id", "userId"])
	})

	it("ignores params prefixed with one than one column", function () {
		const url = "https://dummyjson.com/product/::id"
		expect(extractPathParams(url)).toEqual([])
	})
})
