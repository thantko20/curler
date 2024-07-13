import type { SendReturn, SendOptions, SuccessSendReturn, Output } from './types';

const defaultHeaders = {
	'User-Agent': 'Curler/0.0.1'
};

export const send = async (opts: SendOptions): Promise<SendReturn> => {
	const { url, method, headers, body, signal } = opts;
	try {
		const start = Date.now();
		let response = await fetch(url, {
			method,
			headers: {
				...defaultHeaders,
				...headers
			},
			body,
			signal
		});
		const end = Date.now();
		const durationMs = end - start;

		const contentType = response.headers.get('Content-Type') || 'application/json';
		const responseBody = await response.arrayBuffer();
		const raw = new TextDecoder().decode(responseBody);
		const blob = await response.blob();
		const main: Omit<SuccessSendReturn, 'output'> = {
			isRequestErr: false,
			durationMs,
			originalResponse: response,
			raw,
			headers: Object.fromEntries(response.headers.entries()),
			contentType,
			statusCode: response.status,
			responseBodySize: Number(response.headers.get('Content-Length') || blob.size)
		};
		return {
			...main,
			output: createOutput(contentType, responseBody)
		};
	} catch (err) {
		console.error(err);
		return {
			isRequestErr: true,
			err: err instanceof Error ? err : new Error(String(err))
		};
	}
};

function createOutput(contentType: string, data: ArrayBuffer): Output {
	const mimeType = getMimeType(contentType);
	if (mimeType.startsWith('application/json')) {
		const text = new TextDecoder().decode(data);
		return {
			type: 'json',
			body: JSON.stringify(JSON.parse(text), null, 2)
		};
	} else if (mimeType.startsWith('image/')) {
		return {
			type: 'image',
			body: new Blob([data], { type: mimeType })
		};
	}
	return {
		type: 'binary',
		body: data
	};
}

function getMimeType(contentType: string) {
	return contentType.split(';')[0].trim().toLowerCase();
}
