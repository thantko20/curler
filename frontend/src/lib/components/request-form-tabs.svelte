<script lang="ts">
	import * as Tabs from "./ui/tabs"
	import curlStore from "$lib/curl-store"
	import KeyValueTable from "./key-value-table.svelte"
	import * as Select from "./ui/select"
	import CodeEditor from "./code-editor.svelte"
	let bodySelected = {
		label: "None",
		value: "none"
	}
	let textBodySelected = {
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
		<div>
			<div class="text-sm font-semibold text-gray-500">Query Params</div>
			<KeyValueTable
				pairs={$curlStore.queryParamPairs}
				onPairChange={curlStore.onParamsInputChange}
			/>
		</div>
		<div class="mt-4">
			<div class="text-sm font-semibold text-gray-500">Path Params</div>
			<KeyValueTable
				pairs={Object.entries($curlStore.pathVariables)}
				onPairChange={curlStore.setPathVariable}
				showExtraRow={false}
				enableKeyInput={false}
			/>
		</div>
	</Tabs.Content>
	<Tabs.Content value="headers">
		<div class="text-sm font-semibold text-gray-500">Headers</div>
		<KeyValueTable
			pairs={Object.entries($curlStore.headers)}
			onPairChange={curlStore.onHeaderEntryChange}
		/>
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
						<Select.Item value="raw">Raw</Select.Item>
						<Select.Item value="json">JSON</Select.Item>
						<Select.Item value="yaml">YAML</Select.Item>
					</Select.Content>
				</Select.Root>
			{/if}
		</div>
		<div class="mt-4">
			{#if bodySelected.value === "text"}
				<CodeEditor output={{ body: "", type: textBodySelected.value }} />
			{/if}
			{#if bodySelected.value === "form"}
				<KeyValueTable pairs={[]} onPairChange={() => {}} />
			{/if}
		</div>
	</Tabs.Content>
</Tabs.Root>
