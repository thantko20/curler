<script lang="ts">
	import type { HtmlOutput, JavascriptOutput, JsonOutput, Output, SendReturn } from "$lib/types"
	import CodeMirror from "svelte-codemirror-editor"
	import { getCodeMirrorLangSupport } from "$lib/internals/get-codemirror-lang-support"

	export let sendResult: SendReturn
	let imgSrc: string
	$: {
		if (!sendResult.isRequestErr && sendResult.output.type === "image") {
			imgSrc = URL.createObjectURL(sendResult.output.body)
		}
	}

	function isCodeOutput(output: Output): output is JsonOutput | HtmlOutput | JavascriptOutput {
		return output.type === "json" || output.type === "html" || output.type === "javascript"
	}
</script>

<div class="h-full overflow-auto overflow-y-auto p-4">
	{#if sendResult.isRequestErr}
		<p>Request Error</p>
	{:else if isCodeOutput(sendResult.output)}
		<CodeMirror
			value={sendResult.output.body}
			lang={getCodeMirrorLangSupport(sendResult.output.type)}
			editable={false}
			readonly={true}
			class="h-full overflow-auto"
		/>
	{:else if sendResult.output.type === "image"}
		<img src={imgSrc} class="mx-auto" alt="response" />
	{:else if sendResult.output.type === "binary"}
		<pre class="whitespace-pre-wrap">{sendResult.output.body}</pre>
	{/if}
</div>
