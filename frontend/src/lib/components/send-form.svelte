<script lang="ts">
	import * as Select from "$lib/components/ui/select"
	import { cn } from "$lib/utils"
	import { Button } from "$lib/components/ui/button"
	import { Input } from "$lib/components/ui/input"
	import curlStore from "$lib/curl-store"
	import type { HttpMethod } from "$lib/types"

	type HttpMethodOption = { label: string; value: HttpMethod }

	export let onSend: () => Promise<void>
	export let loading: boolean

	let methods: Array<HttpMethodOption> = [
		{ label: "GET", value: "GET" },
		{ label: "POST", value: "POST" },
		{ label: "DELETE", value: "DELETE" }
	]
	let selectedHttpMethod: HttpMethodOption | undefined = { label: "GET", value: "GET" }
	$: $curlStore.method = selectedHttpMethod?.value ?? "GET"
</script>

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
