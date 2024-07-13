<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import * as Resizable from '$lib/components/ui/resizable';
	import { send } from '$lib/send';
	import type { SendReturn } from '$lib/types';
	import Output from '$lib/components/Output.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';

	type HttpMethod = 'GET' | 'POST';
	type HttpMethodOption = { label: string; value: HttpMethod };

	let methods: Array<HttpMethodOption> = [
		{ label: 'GET', value: 'GET' },
		{ label: 'POST', value: 'POST' }
	];
	let selectedMethodOption: HttpMethodOption | undefined = { label: 'GET', value: 'GET' };
	$: selectedValue = selectedMethodOption?.value;
	let loading = false;
	let url = 'https://dummyjson.com/product';

	let result: SendReturn;

	async function onSend() {
		if (!url || !selectedValue) return;
		try {
			loading = true;
			result = await send({
				headers: {},
				url,
				method: selectedValue
			});
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-screen flex-col">
	<form on:submit|preventDefault={onSend} class="flex p-2">
		<Select.Root items={methods} bind:selected={selectedMethodOption}>
			<Select.Trigger
				class={cn(
					'max-w-36 rounded-r-none border-r-0 font-semibold',

					selectedValue === 'GET' && 'bg-green-50 text-green-500',
					selectedValue === 'POST' && 'bg-blue-50 text-blue-500'
				)}
			>
				<Select.Value placeholder="Select an option" />
			</Select.Trigger>
			<Select.Content>
				{#each methods as method}
					<Select.Item
						value={method.value}
						class={cn(
							'font-semibold',
							method.value === 'GET' &&
								'text-green-500 data-[highlighted]:bg-green-50 data-[highlighted]:text-green-500',
							method.value === 'POST' &&
								'text-blue-500 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-500'
						)}>{method.label}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
		<Input
			bind:value={url}
			class="foucs:ring-0 rounded-l-none rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		/>
		<Button type="submit" class="min-w-40 rounded-l-none border-l-0" {loading}>Send</Button>
	</form>

	<Resizable.PaneGroup direction="vertical" class="flex-1">
		<Resizable.Pane defaultSize={50} minSize={20}>
			<div class="p-2">
				{#if loading}
					<p>Loading</p>
				{/if}
				query params
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle class="bg-gray-300" />
		<Resizable.Pane defaultSize={50} minSize={30} class="relative">
			{#if result}
				<Output sendResult={result} />
			{/if}
			{#if loading}
				<div class="absolute inset-0 flex items-center justify-center bg-black/20">
					<Spinner class="h-6 w-6" />
				</div>
			{/if}
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
