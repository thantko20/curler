<script lang="ts">
	import { EditorState, type Extension } from "@codemirror/state"
	import { EditorView } from "@codemirror/view"
	import { jsonLanguage } from "@codemirror/lang-json"
	import { javascriptLanguage } from "@codemirror/lang-javascript"
	import { htmlLanguage } from "@codemirror/lang-html"
	import { basicSetup } from "codemirror"
	import { onMount } from "svelte"
	import type { CodeOutput } from "$lib/types"

	export let output: CodeOutput

	let className: string = ""
	export { className as class }

	let editorEl: HTMLDivElement
	let editorView: EditorView

	onMount(() => {
		editorView = new EditorView({
			state: createEditorState(output.body),
			parent: editorEl
		})
	})

	$: {
		if (editorView) {
			editorView.dispatch({
				changes: { from: 0, to: editorView.state.doc.length, insert: output.body }
			})
		}
	}

	function createEditorState(doc?: string) {
		let extensions: Extension = [basicSetup, EditorState.readOnly.of(true)]
		const langProvider = getLanguageProvider(output.type)
		if (langProvider) {
			extensions = extensions.concat(langProvider)
		}
		return EditorState.create({
			doc: doc,
			extensions
		})
	}

	function getLanguageProvider(lang: CodeOutput["type"]) {
		switch (lang) {
			case "javascript":
				return javascriptLanguage
			case "html":
				return htmlLanguage
			case "json":
				return jsonLanguage
			default:
				return undefined
		}
	}
</script>

<div class={className} bind:this={editorEl}></div>
