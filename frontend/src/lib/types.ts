export const httpMethods = {
	GET: 'GET',
	POST: 'POST'
} as const;

export type HttpMethod = (typeof httpMethods)[keyof typeof httpMethods];

type OutputBlueprint<T extends string, U extends unknown> = { type: T; body: U };

export type JsonOutput = OutputBlueprint<'json', string>;

export type ImageOutput = OutputBlueprint<'image', Blob>;

export type BinaryOutput = OutputBlueprint<'binary', ArrayBuffer>;

export type Output = JsonOutput | ImageOutput | BinaryOutput;

export type SuccessSendReturn = {
	isRequestErr: false;
	statusCode: number;
	headers: Record<string, string>;
	contentType: string;
	mimeType: string;
	durationMs: number;
	raw: string;
	originalResponse: globalThis.Response;
	responseBodySize: number;
	output: Output;
};

export type SendReturn =
	| {
			isRequestErr: true;
			err: Error;
	  }
	| SuccessSendReturn;

export type SendOptions = {
	url: string;
	method: HttpMethod;
	headers: HeadersInit;
	body?: BodyInit;
	signal?: AbortSignal;
};
