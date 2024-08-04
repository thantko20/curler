<script lang="ts">
	import * as Tabs from "./ui/tabs"
	import requestStore from "$lib/requests/request-store"
	import KeyValueTable from "./key-value-table.svelte"
	import RequestBody from "./request-body.svelte"
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
		<RequestBody />
	</Tabs.Content>
</Tabs.Root>
