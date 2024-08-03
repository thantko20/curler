<script lang="ts">
	import * as Tabs from "./ui/tabs"
	import requestStore from "$lib/requests/request-store"
	import KeyValueTable from "./key-value-table.svelte"
	import * as Select from "./ui/select"
	import CodeEditor from "./code-editor.svelte"
	import CodeMirror from "svelte-codemirror-editor"
	import { getCodeMirrorLangSupport } from "$lib/internals/get-codemirror-lang-support"

	type TextBody = "text" | "json" | "yaml"
	type TextBodySelected = { label: string; value: TextBody }
	let bodySelected = {
		label: "None",
		value: "none"
	}
	let textBodySelected: TextBodySelected = {
		label: "JSON",
		value: "json"
	}
</script>

<Tabs.Root value="params" class="overflow-auto p-2">
	<Tabs.List>
		<Tabs.Trigger value="params">Params</Tabs.Trigger>
		<Tabs.Trigger value="headers">Headers</Tabs.Trigger>
		<Tabs.Trigger value="body">Body</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="params">
		<KeyValueTable
			pairs={$requestStore.queryParams}
			onPairChange={requestStore.onQueryParamsChange}
		/>
	</Tabs.Content>
	<Tabs.Content value="headers">
		<KeyValueTable pairs={$requestStore.headers} onPairChange={requestStore.onHeadersChange} />
	</Tabs.Content>
	<Tabs.Content value="body">
		<div class="flex gap-2">
			<Select.Root bind:selected={bodySelected}>
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
			{/if}
		</div>
		<div class="mt-4">
			{#if bodySelected.value === "text"}
				<CodeMirror
					bind:value={$requestStore.body}
					lang={getCodeMirrorLangSupport(textBodySelected.value)}
					editable={true}
					readonly={false}
				/>
			{/if}
			{#if bodySelected.value === "form"}
				<KeyValueTable pairs={[]} onPairChange={() => {}} />
			{/if}
		</div>
	</Tabs.Content>
</Tabs.Root>
