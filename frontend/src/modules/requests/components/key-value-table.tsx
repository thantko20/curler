import { useRef, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { NameValuePair } from "@/types"

type Props = {
  items: NameValuePair[]
  onItemChange: (index: number | null, updatedItem: NameValuePair) => void
  keyHeader?: string
  valueHeader?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export const KeyValueTable = (props: Props) => {
  const {
    items,
    onItemChange,
    keyHeader = "Name",
    valueHeader = "Value",
    keyPlaceholder = "name",
    valuePlaceholder = "value"
  } = props
  const lastKeyInputRef = useRef<HTMLInputElement>(null)
  const lastValueInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lastKeyInputRef.current) {
      lastKeyInputRef.current.focus()
    }
  }, [items.length])

  const handleChange = (
    index: number | null,
    field: "name" | "value",
    newValue: string
  ) => {
    if (index === null) {
      const newItem = { name: newValue, value: "", enabled: true }
      onItemChange(null, newItem)
    } else {
      const updatedItem = { ...items[index], [field]: newValue }
      onItemChange(index, updatedItem)
    }
  }

  const handleCheck = (index: number, checked: boolean) => {
    onItemChange(index, { ...items[index], enabled: checked })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Enabled</span>
          </TableHead>
          <TableHead>{keyHeader}</TableHead>
          <TableHead>{valueHeader}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <Checkbox
                checked={item.enabled}
                onCheckedChange={(checked) =>
                  handleCheck(index, checked as boolean)
                }
              />
            </TableCell>
            <TableCell>
              <Input
                ref={index === items.length - 1 ? lastKeyInputRef : null}
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                disabled={!item.enabled}
                placeholder={keyPlaceholder}
              />
            </TableCell>
            <TableCell>
              <Input
                ref={index === items.length - 1 ? lastValueInputRef : null}
                value={item.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                disabled={!item.enabled}
                placeholder={valuePlaceholder}
              />
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
            <Checkbox disabled />
          </TableCell>
          <TableCell>
            <Input
              value=""
              onChange={(e) => handleChange(null, "name", e.target.value)}
              placeholder={keyPlaceholder}
            />
          </TableCell>
          <TableCell>
            <Input value="" disabled placeholder={valuePlaceholder} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
