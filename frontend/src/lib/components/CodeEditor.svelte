<script lang="ts">
	import { EditorState, type Extension } from '@codemirror/state';
	import { EditorView } from '@codemirror/view';
	import { jsonLanguage } from '@codemirror/lang-json';
	import { javascriptLanguage } from '@codemirror/lang-javascript';
	import { html, htmlLanguage } from '@codemirror/lang-html';
	import { basicSetup } from 'codemirror';
	import { onMount } from 'svelte';
	import type { JsonOutput } from '$lib/types';

	export let output: JsonOutput;

	export let className: string = '';
	export let lang: string = 'json';

	let editorEl: HTMLDivElement;
	let editorView: EditorView;

	onMount(() => {
		editorView = new EditorView({
			state: createEditorState(output.body),
			parent: editorEl
		});
	});

	function createEditorState(doc?: string) {
		let extensions: Extension = [basicSetup, EditorState.readOnly.of(true)];
		const langProvider = getLanguageProvider(lang);
		if (langProvider) {
			extensions = extensions.concat(langProvider);
		}
		return EditorState.create({
			doc: doc,
			extensions
		});
	}

	function getLanguageProvider(lang: string) {
		switch (lang) {
			case 'javascript':
				return javascriptLanguage;
			case 'html':
				return htmlLanguage;
			case 'json':
				return jsonLanguage;
			default:
				return undefined;
		}
	}
</script>

<div class={className} bind:this={editorEl}></div>
