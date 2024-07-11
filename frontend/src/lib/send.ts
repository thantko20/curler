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
		const blob = await response.blob();
		const raw = await blob.text();
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
			output: await createOutput(contentType, blob)
		};
	} catch (err) {
		console.log(err);
		return {
			isRequestErr: true,
			err
		} as SendReturn;
	}
};

async function createOutput(contentType: string, blob: Blob): Promise<Output> {
	if (contentType.startsWith('application/json')) {
		const raw = await blob.text();
		return {
			type: 'json',
			body: JSON.stringify(JSON.parse(raw), null, 2)
		};
	} else if (contentType.startsWith('image/')) {
		return {
			type: 'image',
			body: blob
		};
	}
	return {
		type: 'binary',
		body: await blob.text()
	};
}
