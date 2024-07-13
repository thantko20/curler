export const httpMethods = {
	GET: "GET",
	POST: "POST"
} as const

export type HttpMethod = (typeof httpMethods)[keyof typeof httpMethods]

export type OutputType = "json" | "image" | "binary" | "html" | "javascript"

type OutputBlueprint<T extends OutputType, U extends unknown> = { type: T; body: U }

export type JsonOutput = OutputBlueprint<"json", string>

export type ImageOutput = OutputBlueprint<"image", Blob>

export type BinaryOutput = OutputBlueprint<"binary", ArrayBuffer>

export type HtmlOutput = OutputBlueprint<"html", string>

export type JavascriptOutput = OutputBlueprint<"javascript", string>

export type CodeOutput = JsonOutput | HtmlOutput | JavascriptOutput

export type Output = CodeOutput | ImageOutput | BinaryOutput

export type SuccessSendReturn = {
	isRequestErr: false
	statusCode: number
	headers: Record<string, string>
	contentType: string
	mimeType: string
	durationMs: number
	raw: string
	originalResponse: globalThis.Response
	responseBodySize: number
	output: Output
}

export type SendReturn =
	| {
			isRequestErr: true
			err: Error
	  }
	| SuccessSendReturn

export type SendOptions = {
	url: string
	method: HttpMethod
	headers: HeadersInit
	body?: BodyInit
	signal?: AbortSignal
}
