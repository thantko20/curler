import { DefaultHeaders } from "./constants"
import type { SendReturn, SendOptions, SuccessSendReturn, Output } from "./types"

export const send = async (opts: SendOptions): Promise<SendReturn> => {
	const { url, method, headers, body, signal } = opts
	try {
		const start = Date.now()
		let response = await fetch(url, {
			method,
			headers: {
				...DefaultHeaders,
				...headers
			},
			body,
			signal
		})
		const end = Date.now()
		const durationMs = end - start

		const contentType = response.headers.get("Content-Type") || "application/json"
		const mimeType = getMimeType(contentType)
		const responseBody = await response.arrayBuffer()
		const raw = new TextDecoder().decode(responseBody)
		const main: Omit<SuccessSendReturn, "output"> = {
			isRequestErr: false,
			durationMs,
			originalResponse: response,
			raw,
			headers: Object.fromEntries(response.headers.entries()),
			contentType,
			mimeType,
			statusCode: response.status,
			responseBodySize: Number(response.headers.get("Content-Length") || responseBody.byteLength)
		}
		return {
			...main,
			output: createOutput(mimeType, responseBody)
		}
	} catch (err) {
		console.error(err)
		return {
			isRequestErr: true,
			err: err instanceof Error ? err : new Error(String(err))
		}
	}
}

function createOutput(mimeType: string, data: ArrayBuffer): Output {
	const rawText = new TextDecoder().decode(data)
	if (mimeType.startsWith("application/json")) {
		return {
			type: "json",
			body: JSON.stringify(JSON.parse(rawText), null, 2)
		}
	} else if (mimeType.startsWith("text/html")) {
		return {
			type: "html",
			body: rawText
		}
	} else if (mimeType.startsWith("application/javascript")) {
		return {
			type: "javascript",
			body: rawText
		}
	} else if (mimeType.startsWith("image/")) {
		return {
			type: "image",
			body: new Blob([data], { type: mimeType })
		}
	}
	return {
		type: "binary",
		body: rawText
	}
}

function getMimeType(contentType: string) {
	return contentType.split(";")[0].trim().toLowerCase()
}
