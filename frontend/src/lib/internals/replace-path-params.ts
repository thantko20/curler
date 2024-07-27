/**
 * @description A function to replace path params in a URL with given param values.
 * @example
 * ```ts
 *  const url = "https://dummyjson.com/product/:id/user/:userId"
 *  const pathParams = [{ key: "id", value: "1" }, { key: "userId", value: "2" }]
 *  replacePathParams(url, pathParams) // "https://dummyjson.com/product/1/user/2"
 * ```
 */
export function replacePathParams(url: string, pathParams: Array<{ key: string; value: string }>) {
	const path = url.split("?")[0]
	let result: string = path

	for (const param of pathParams) {
		result = result.replace(`:${param.key}`, param.value)
	}

	return result
}
