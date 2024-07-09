<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Send } from '$lib/wailsjs/go/main/App';
	import type { Selected } from 'bits-ui';

	type HttpMethod = 'GET' | 'POST';
	type HttpMethodOption = { label: string; value: HttpMethod };

	let methods: Array<HttpMethodOption> = [
		{ label: 'GET', value: 'GET' },
		{ label: 'POST', value: 'POST' }
	];
	let selectedMethodOption: HttpMethodOption | undefined = { label: 'GET', value: 'GET' };
	let response = '';
	let loading = false;
	let url = 'https://dummyjson.com/product';
	let imgSrc = '';

	async function send() {
		if (!url || !selectedMethodOption) return;
		loading = true;
		const { body, contentType } = await Send({
			method: selectedMethodOption.value,
			url,
			body:
				selectedMethodOption.value === 'POST' ? JSON.stringify({ name: 'New Product' }) : undefined,
			headers: {
				'Content-Type': 'application/json'
			}
		}).finally(() => (loading = false));
		if (contentType.startsWith('application/json')) {
			response = JSON.stringify(JSON.parse(body), null, 4);
		}
		// will only support json for now :D
		// if (contentType.startsWith('image/')) {
		// 	const bsLength = body.length;
		// 	let bytes = new Uint8Array(bsLength);

		// 	for (let i = 0; i < bsLength; i++) {
		// 		bytes[i] = body.charCodeAt(i);
		// 	}

		// 	// Create a Blob from the byte array
		// 	let blob = new Blob([bytes], { type: contentType });
		// 	imgSrc = URL.createObjectURL(blob);
		// }
	}

	async function onSelectedChange(val: HttpMethodOption | undefined) {
		selectedMethodOption = val;
	}
</script>

<div class="flex gap-2 bg-slate-100 p-2">
	<Select.Root
		selected={selectedMethodOption}
		onSelectedChange={(val) => onSelectedChange(val?.value)}
	>
		<Select.Trigger>
			<Select.Value placeholder="Select an option" />
		</Select.Trigger>
		<Select.Content>
			{#each methods as method}
				<Select.Item value={method}>{method.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Input bind:value={url} />
	<Button on:click={send}>Send</Button>
</div>

{#if loading}
	<p>Loading</p>
{/if}

{#if response}
	<div class="mt-4 p-4">
		<pre>{response}</pre>
	</div>
{/if}

{#if imgSrc}
	<img src={imgSrc} alt="response" width="100" height="100" />
{/if}
