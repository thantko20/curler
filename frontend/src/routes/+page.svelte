<script lang="ts">
	import * as Resizable from "$lib/components/ui/resizable"
	import { send } from "$lib/send"
	import type { SendReturn } from "$lib/types"
	import Output from "$lib/components/output.svelte"
	import Spinner from "$lib/components/ui/Spinner.svelte"
	import RequestFormTabs from "$lib/components/request-form-tabs.svelte"
	import curlStore from "$lib/curl-store"
	import SendForm from "$lib/components/send-form.svelte"

	let loading = false

	let result: SendReturn | undefined = undefined

	async function onSend() {
		if (!$curlStore.url || !$curlStore.method) return
		try {
			loading = true
			result = await send({
				headers: $curlStore.headers,
				url: curlStore.formattedUrl,
				method: $curlStore.method
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
