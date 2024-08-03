<script lang="ts">
	import * as Select from "$lib/components/ui/select"
	import { cn } from "$lib/utils"
	import { Button } from "$lib/components/ui/button"
	import { Input } from "$lib/components/ui/input"
	import type { HttpMethod } from "$lib/types"
	import requestStore from "$lib/requests/request-store"

	type HttpMethodOption = { label: string; value: HttpMethod }

	export let onSend: () => Promise<void>
	export let loading: boolean

	let methods: Array<HttpMethodOption> = [
		{ label: "GET", value: "GET" },
		{ label: "POST", value: "POST" },
		{ label: "DELETE", value: "DELETE" },
		{ label: "PATCH", value: "PATCH" },
		{ label: "PUT", value: "PUT" }
	]
	let selectedHttpMethod: HttpMethodOption | undefined = { label: "GET", value: "GET" }
	$: $requestStore.method = selectedHttpMethod?.value ?? "GET"
</script>

<form on:submit|preventDefault={onSend} class="flex p-2">
	<Select.Root items={methods} bind:selected={selectedHttpMethod}>
		<Select.Trigger
			class={cn(
				"max-w-36 rounded-r-none border-r-0 font-semibold",

				$requestStore.method === "GET" && "text-green-500",
				$requestStore.method === "POST" && "text-blue-500",
				$requestStore.method === "DELETE" && "text-red-500",
				$requestStore.method === "PATCH" && "text-yellow-500",
				$requestStore.method === "PUT" && "text-purple-500"
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
						method.value === "GET" && "text-green-500 data-[highlighted]:text-green-500",
						method.value === "POST" && "text-blue-500 data-[hgihlighted]:text-blue-500",
						method.value === "DELETE" && "text-red-500 data-[highlighted]:text-red-500",
						method.value === "PATCH" && "text-yellow-500 data-[highlighted]:text-yellow-500",
						method.value === "PUT" && "text-purple-500 data-[highlighted]:text-purple-500"
					)}>{method.label}</Select.Item
				>
			{/each}
		</Select.Content>
	</Select.Root>
	<Input
		bind:value={$requestStore.url}
		class="foucs:ring-0 rounded-l-none rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
	/>
	<Button type="submit" class="min-w-40 rounded-l-none border-l-0" {loading}>Send</Button>
</form>
