<script lang="ts">
	import type { Output, SendReturn } from "$lib/types"
	import CodeEditor from "./code-editor.svelte"

	export let sendResult: SendReturn
	let imgSrc: string
	$: {
		if (!sendResult.isRequestErr && sendResult.output.type === "image") {
			imgSrc = URL.createObjectURL(sendResult.output.body)
		}
	}

	function isCodeOutput(output: Output) {
		return output.type === "json" || output.type === "html" || output.type === "javascript"
	}
</script>

<div class="h-full overflow-auto overflow-y-auto p-4">
	{#if sendResult.isRequestErr}
		<p>Request Error</p>
	{:else if isCodeOutput(sendResult.output)}
		<CodeEditor class="h-full overflow-auto" output={sendResult.output} />
	{:else if sendResult.output.type === "image"}
		<img src={imgSrc} class="mx-auto" alt="response" />
	{:else if sendResult.output.type === "binary"}
		<pre class="whitespace-pre-wrap">{sendResult.output.body}</pre>
	{/if}
</div>
