export function extractPathParams(url: string) {
	const splitted = url.split("?")
	const path = splitted[0] ?? ""
	const pathParams = path.split("/").filter((p) => p.startsWith(":") && p.length > 1)
	return pathParams
}
