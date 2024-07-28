import type { Pairs } from "$lib/types"

export function extractQueryParams(url: string): Pairs {
	const splitted = url.split("?")
	const search = splitted[1] ?? ""
	return Array.from(new URLSearchParams(search).entries()).map(([key, value]) => ({ key, value }))
}
