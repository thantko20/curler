<script lang="ts">
	import * as Resizable from "$lib/components/ui/resizable"
	import { send } from "$lib/send"
	import type { SendReturn } from "$lib/types"
	import Output from "$lib/components/output.svelte"
	import Spinner from "$lib/components/ui/Spinner.svelte"
	import RequestFormTabs from "$lib/components/request-form-tabs.svelte"
	import requestStore from "$lib/requests/request-store"
	import SendForm from "$lib/components/send-form.svelte"

	let loading = false

	let result: SendReturn | undefined = undefined

	const formatRequest = () => {
		function formatUrl() {
			if (!$requestStore.url) return ""
			let url = $requestStore.url
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				url = `https://${url}`
			}
			const urlObj = new URL(url)
			$requestStore.queryParams.forEach((param) => {
				urlObj.searchParams.append(param.key, param.value)
			})
			return urlObj.toString()
		}

		function formatHeaders() {
			const headers = new Headers($requestStore.headers.map((header) => [header.key, header.value]))
			if (typeof $requestStore.body === "string") {
				headers.set("Content-Type", "application/json")
			}
			// return Array.from(headers.entries())
			return headers
		}
		console.log(formatHeaders())

		return {
			url: formatUrl(),
			body: $requestStore.body,
			method: $requestStore.method,
			headers: formatHeaders(),
			pathParams: $requestStore.pathParams,
			queryParams: $requestStore.queryParams
		}
	}

	async function onSend() {
		if (!$requestStore.url || !$requestStore.method) return
		const formattedRequest = formatRequest()
		try {
			loading = true
			result = await send({
				headers: formattedRequest.headers,
				url: formattedRequest.url,
				method: formattedRequest.method,
				body: formattedRequest.body
			})
		} catch (error) {
			console.error(error)
		} finally {
			loading = false
		}
	}
</script>

<div class="flex h-screen flex-col">
	<SendForm {onSend} {loading} />
	<Resizable.PaneGroup direction="vertical" class="flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<div class="h-full overflow-auto">
				<RequestFormTabs />
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle class="bg-gray-300" />
		<Resizable.Pane defaultSize={50} minSize={30} class="relative">
			<div class="relative h-full overflow-auto">
				{#if result}
					<Output sendResult={result} />
				{/if}
				{#if loading}
					<div class="absolute inset-0 flex items-center justify-center bg-black/40 text-gray-50">
						<Spinner class="mr-4 h-6 w-6" />
						Loading
					</div>
				{/if}
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
