<script lang="ts">
	import type { SendReturn } from '$lib/types';
	import CodeEditor from './CodeEditor.svelte';

	export let sendResult: SendReturn;
	let imgSrc: string;
	if (!sendResult.isRequestErr && sendResult.output.type === 'image') {
		imgSrc = URL.createObjectURL(sendResult.output.body);
	}
</script>

<div class="h-full overflow-auto overflow-y-auto p-4">
	{#if sendResult.isRequestErr}
		<p>Request Error</p>
	{:else if sendResult.output.type === 'json'}
		<CodeEditor className="h-full overflow-auto" output={sendResult.output} />
	{:else if sendResult.output.type === 'image'}
		<img src={imgSrc} class="mx-auto" alt="response" />
	{:else if sendResult.output.type === 'binary'}
		<pre class="whitespace-pre-wrap">{sendResult.output.body}</pre>
	{/if}
</div>
