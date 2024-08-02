<script lang="ts">
	import * as Table from "$lib/components/ui/table"
	import { Input } from "$lib/components/ui/input"
	import type { Pairs } from "$lib/types"

	export let pairs: Pairs = [{ key: "", value: "" }]
	export let onPairChange: (pair: Pairs[number], index: number) => void
	export let showExtraRow: boolean = true
	export let enableKeyInput: boolean = true

	$: derviedPairs = showExtraRow ? [...pairs, { key: "", value: "" }] : pairs
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Key</Table.Head>
			<Table.Head>Value</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each derviedPairs as { key, value }, i}
			<Table.Row>
				<Table.Cell class="p-2"
					><Input
						placeholder="key"
						value={key}
						on:input={(e) => {
							onPairChange({ key: e.currentTarget.value, value }, i)
						}}
						disabled={!enableKeyInput}
						class="px-2 py-1"
					/></Table.Cell
				>
				<Table.Cell class="p-2"
					><Input
						placeholder="value"
						{value}
						on:input={(e) => onPairChange({ key, value: e.currentTarget.value }, i)}
						class="px-2 py-1"
					/></Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
