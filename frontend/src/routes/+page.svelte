<script lang="ts">
	import { Button } from "$lib/components/ui/button"
	import { Input } from "$lib/components/ui/input"
	import * as Select from "$lib/components/ui/select"
	import { cn } from "$lib/utils"
	import * as Resizable from "$lib/components/ui/resizable"
	import { send } from "$lib/send"
	import type { HttpMethod, SendReturn } from "$lib/types"
	import Output from "$lib/components/output.svelte"
	import Spinner from "$lib/components/ui/Spinner.svelte"
	import RequestFormTabs from "$lib/components/request-form-tabs.svelte"
	import curlStore from "$lib/curl-store"

	type HttpMethodOption = { label: string; value: HttpMethod }

	let methods: Array<HttpMethodOption> = [
		{ label: "GET", value: "GET" },
		{ label: "POST", value: "POST" },
		{ label: "DELETE", value: "DELETE" }
	]
	let selectedHttpMethod: HttpMethodOption | undefined = { label: "GET", value: "GET" }
	$: $curlStore.method = selectedHttpMethod?.value ?? "GET"
	let loading = false

	let result: SendReturn

	async function onSend() {
		if (!$curlStore.url || !$curlStore.method) return
		try {
			loading = true
			result = await send({
				headers: {},
				url: $curlStore.url,
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
	<form on:submit|preventDefault={onSend} class="flex p-2">
		<Select.Root items={methods} bind:selected={selectedHttpMethod}>
			<Select.Trigger
				class={cn(
					"max-w-36 rounded-r-none border-r-0 font-semibold",

					$curlStore.method === "GET" && "bg-green-50 text-green-500",
					$curlStore.method === "POST" && "bg-blue-50 text-blue-500",
					$curlStore.method === "DELETE" && "bg-red-50 text-red-500"
				)}
			>
				<Select.Value placeholder="Select an option" />
			</Select.Trigger>
			<Select.Content>
				{#each methods as method}
					<Select.Item
						value={method.value}
						class={cn(
							"font-semibold",
							method.value === "GET" &&
								"text-green-500 data-[highlighted]:bg-green-50 data-[highlighted]:text-green-500",
							method.value === "POST" &&
								"text-blue-500 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-500",
							method.value === "DELETE" &&
								"text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500"
						)}>{method.label}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
		<Input
			bind:value={$curlStore.url}
			class="foucs:ring-0 rounded-l-none rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		/>
		<Button type="submit" class="min-w-40 rounded-l-none border-l-0" {loading}>Send</Button>
	</form>

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
