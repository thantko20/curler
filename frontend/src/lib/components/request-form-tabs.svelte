<script>
	import * as Table from "$lib/components/ui/table"
	import { Input } from "$lib/components/ui/input"
	import * as Tabs from "./ui/tabs"
</script>

<Tabs.Root value="params" class="p-2">
	<Tabs.List>
		<Tabs.Trigger value="params">Params</Tabs.Trigger>
		<Tabs.Trigger value="headers">Headers</Tabs.Trigger>
		<Tabs.Trigger value="body">Body</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="params">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Key</Table.Head>
					<Table.Head>Value</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell><Input placeholder="key" /></Table.Cell>
					<Table.Cell><Input placeholder="value" /></Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Tabs.Content>
</Tabs.Root>
