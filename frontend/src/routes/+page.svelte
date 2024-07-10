<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { Send } from '$lib/wailsjs/go/main/App';
	import * as Resizable from '$lib/components/ui/resizable';

	import { basicSetup } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { EditorView } from '@codemirror/view';
	import { jsonLanguage } from '@codemirror/lang-json';
	import { onMount } from 'svelte';

	let editorEl: HTMLDivElement;
	let editorView: EditorView;

	onMount(() => {
		editorView = new EditorView({
			state: createEditorState(),
			parent: editorEl
		});
	});

	type HttpMethod = 'GET' | 'POST';
	type HttpMethodOption = { label: string; value: HttpMethod };

	let methods: Array<HttpMethodOption> = [
		{ label: 'GET', value: 'GET' },
		{ label: 'POST', value: 'POST' }
	];
	let selectedMethodOption: HttpMethodOption | undefined = { label: 'GET', value: 'GET' };
	$: selectedValue = selectedMethodOption?.value;
	let response = '';
	let loading = false;
	let url = 'https://dummyjson.com/product';

	async function send() {
		if (!url || !selectedValue) return;
		loading = true;
		const { body, contentType } = await Send({
			method: selectedValue,
			url,
			body: selectedValue === 'POST' ? JSON.stringify({ name: 'New Product' }) : undefined,
			headers: {
				'Content-Type': 'application/json'
			}
		}).finally(() => (loading = false));
		if (contentType.startsWith('application/json')) {
			response = JSON.stringify(JSON.parse(body), null, 2);
			editorView.setState(createEditorState(response));
		}
	}
	function createEditorState(doc?: string) {
		return EditorState.create({
			doc: doc,
			extensions: [basicSetup, jsonLanguage, EditorState.readOnly.of(true)]
		});
	}
</script>

<div class="flex h-screen flex-col">
	<form on:submit|preventDefault={send} class="flex p-2">
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
		<Button type="submit" class="min-w-40 rounded-l-none border-l-0">Send</Button>
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
		<Resizable.Pane defaultSize={50} minSize={30}>
			<div class="h-full overflow-auto overflow-y-auto p-4" bind:this={editorEl}></div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
