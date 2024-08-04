export const httpMethods = {
	GET: "GET",
	POST: "POST",
	DELETE: "DELETE",
	PATCH: "PATCH",
	PUT: "PUT"
} as const

export type HttpMethod = (typeof httpMethods)[keyof typeof httpMethods]

export type OutputType =
	| "json"
	| "image"
	| "binary"
	| "html"
	| "javascript"
	| "text"
	| "yaml"
	| "yml"

type OutputBlueprint<T extends OutputType, U extends unknown> = { type: T; body: U }

export type JsonOutput = OutputBlueprint<"json", string>

export type ImageOutput = OutputBlueprint<"image", Blob>

export type BinaryOutput = OutputBlueprint<"binary", string>

export type HtmlOutput = OutputBlueprint<"html", string>

export type JavascriptOutput = OutputBlueprint<"javascript", string>

export type TextOutput = OutputBlueprint<"text", string>

export type YamlOutput = OutputBlueprint<"yaml", string>

export type CodeOutput = JsonOutput | HtmlOutput | JavascriptOutput | TextOutput | YamlOutput

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
	// method: HttpMethod
	method: string
	headers: Headers
	body?: BodyInit
	signal?: AbortSignal
}

export type Pairs<Value extends unknown = string> = Array<{ key: string; value: Value }>

export type BodyType =
	| "text"
	| "multipart/form-data"
	| "x-www-form-urlencoded"
	| "json"
	| "yaml"
	| "html"

export type RequestItem = {
	url: string
	method: string
	headers: Pairs
	// body: any
	queryParams: Pairs
	pathParams: Pairs
	requestId: string
	// bodyType?: BodyType
} & (
	| {
			bodyType: Extract<BodyType, "json" | "yaml" | "text" | "html">
			body: string
	  }
	| {
			bodyType: Extract<BodyType, "multipart/form-data" | "x-www-form-urlencoded">
			body: Pairs
	  }
	| {
			bodyType?: undefined
			body?: undefined
	  }
)
