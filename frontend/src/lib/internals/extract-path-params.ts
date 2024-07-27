/**
 * @description A function to extract path parameters from a URL.
 * @example
 * ```ts
 *  const url = "https://dummyjson.com/product/:id/user/:userId"
 *  extractPathParams(url) // ["id", "userId"]
 * ```
 */
export function extractPathParams(url: string): Array<string> {
	const splitted = url.split("?")
	const path = splitted[0] ?? ""
	const pathParams = path
		.split("/")
		// filter strings that start with a colon, and has only one column
		// for example, :id is fine while ::id is not
		.filter(isValidPathParam)
		.map((p) => p.slice(1))
	return Array.from(new Set(pathParams))
}

function isValidPathParam(str: string) {
	return (
		str.startsWith(":") && Array.from(str).filter((c) => c === ":").length === 1 && str.length > 1
	)
}
