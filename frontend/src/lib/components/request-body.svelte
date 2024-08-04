<script lang="ts">
	import KeyValueTable from "./key-value-table.svelte"
	import requestStore from "$lib/requests/request-store"
	import * as Select from "./ui/select"
	import CodeMirror from "svelte-codemirror-editor"
	import { getCodeMirrorLangSupport } from "$lib/internals/get-codemirror-lang-support"

	type TextBody = "text" | "json" | "yaml"
	type FormBody = "multipart/form-data" | "x-www-form-urlencoded"
	type TextBodySelected = { label: string; value: TextBody }
	type FormBodySelected = { label: string; value: FormBody }

	let bodySelected = {
		label: "None",
		value: "none"
	}

	let textBodySelected: TextBodySelected | undefined = {
		label: "JSON",
		value: "json"
	}

	$: {
		if (bodySelected.value === "text") {
			requestStore.onBodyTypeChange(textBodySelected?.value)
		} else if (bodySelected.value === "form") {
			requestStore.onBodyTypeChange(formSelect?.value)
		} else {
			requestStore.onBodyTypeChange(undefined)
		}
	}

	let formSelect: FormBodySelected | undefined = {
		label: "Multipart",
		value: "multipart/form-data"
	}
</script>

<div>
	<div class="flex gap-2">
		<Select.Root
			bind:selected={bodySelected}
			onSelectedChange={() => requestStore.onBodyTypeChange(undefined)}
		>
			<Select.Trigger class="w-36">
				<Select.Value placeholder="Select an option" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="none">None</Select.Item>
				<Select.Item value="text">Text</Select.Item>
				<Select.Item value="form">Form</Select.Item>
			</Select.Content>
		</Select.Root>
		{#if bodySelected.value === "text"}
			<Select.Root bind:selected={textBodySelected}>
				<Select.Trigger class="w-36">
					<Select.Value placeholder="Select an option" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="html">Raw</Select.Item>
					<Select.Item value="json">JSON</Select.Item>
					<Select.Item value="yaml">YAML</Select.Item>
				</Select.Content>
			</Select.Root>
		{:else if bodySelected.value === "form"}
			<Select.Root bind:selected={formSelect}>
				<Select.Trigger class="w-36">
					<Select.Value placeholder="Select an option" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="multipart/form-data">Multipart</Select.Item>
					<Select.Item value="x-www-form-urlencoded">URL Encoded</Select.Item>
				</Select.Content>
			</Select.Root>
		{/if}
	</div>
	<div class="mt-4">
		{#if $requestStore.bodyType === "text" || $requestStore.bodyType === "json" || $requestStore.bodyType === "yaml" || $requestStore.bodyType === "html"}
			<CodeMirror
				bind:value={$requestStore.body}
				lang={getCodeMirrorLangSupport($requestStore.bodyType)}
				editable={true}
				readonly={false}
			/>
		{:else if $requestStore.bodyType === "multipart/form-data"}
			<KeyValueTable pairs={$requestStore.body} onPairChange={requestStore.onFormBodyChange} />
		{:else if $requestStore.bodyType === "x-www-form-urlencoded"}
			<KeyValueTable pairs={$requestStore.body} onPairChange={requestStore.onFormBodyChange} />
		{/if}
	</div>
</div>
