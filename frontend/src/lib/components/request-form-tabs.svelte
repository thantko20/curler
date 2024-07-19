<script lang="ts">
	import * as Tabs from "./ui/tabs"
	import curlStore from "$lib/curl-store"
	import KeyValueTable from "./key-value-table.svelte"
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
			pairs={[["Content-Type", "application/json"]]}
			onPairChange={() => {}}
			showExtraRow={false}
		/>
	</Tabs.Content>
</Tabs.Root>
