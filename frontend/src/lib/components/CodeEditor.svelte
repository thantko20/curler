<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView } from '@codemirror/view';
	import { jsonLanguage } from '@codemirror/lang-json';
	import { basicSetup } from 'codemirror';
	import { onMount } from 'svelte';
	import type { JsonOutput } from '$lib/types';

	export let output: JsonOutput;

	export let className: string = '';

	let editorEl: HTMLDivElement;
	let editorView: EditorView;

	onMount(() => {
		editorView = new EditorView({
			state: createEditorState(output.body),
			parent: editorEl
		});
	});

	function createEditorState(doc?: string) {
		return EditorState.create({
			doc: doc,
			extensions: [basicSetup, jsonLanguage, EditorState.readOnly.of(true)]
		});
	}
</script>

<div class={className} bind:this={editorEl}></div>
