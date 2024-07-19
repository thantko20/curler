<script lang="ts">
	import * as Table from "$lib/components/ui/table"
	import { Input } from "$lib/components/ui/input"

	export let pairs: [string, string][] = [["", ""]]
	export let onPairChange: (pair: [string, string], index: number) => void
	export let showExtraRow: boolean = true
	export let enableKeyInput: boolean = true

	$: derviedPairs = showExtraRow ? [...pairs, ["", ""]] : pairs
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Key</Table.Head>
			<Table.Head>Value</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each derviedPairs as [key, value], i}
			<Table.Row>
				<Table.Cell class="p-2"
					><Input
						placeholder="key"
						value={key}
						on:input={(e) => {
							onPairChange([e.currentTarget.value, value], i)
						}}
						disabled={!enableKeyInput}
					/></Table.Cell
				>
				<Table.Cell class="p-2"
					><Input
						placeholder="value"
						{value}
						on:input={(e) => onPairChange([key, e.currentTarget.value], i)}
					/></Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
