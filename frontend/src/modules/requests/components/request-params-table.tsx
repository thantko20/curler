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
  queryParams: NameValuePair[]
  onParamChange: (index: number | null, updatedParam: NameValuePair) => void
}

export const RequestParamsTable = (props: Props) => {
  const { queryParams, onParamChange } = props
  const lastNameInputRef = useRef<HTMLInputElement>(null)
  const lastValueInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lastNameInputRef.current) {
      lastNameInputRef.current.focus()
    }
  }, [queryParams.length])

  const handleChange = (
    index: number | null,
    field: "name" | "value",
    newValue: string
  ) => {
    if (index === null) {
      const newParam = { name: newValue, value: "", enabled: true }
      onParamChange(null, newParam)
    } else {
      const updatedParam = { ...queryParams[index], [field]: newValue }
      onParamChange(index, updatedParam)
    }
  }

  const handleCheck = (index: number, checked: boolean) => {
    onParamChange(index, { ...queryParams[index], enabled: checked })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Enabled</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queryParams.map((param, index) => (
          <TableRow key={index}>
            <TableCell>
              <Checkbox
                checked={param.enabled}
                onCheckedChange={handleCheck.bind(null, index)}
              />
            </TableCell>
            <TableCell>
              <Input
                ref={index === queryParams.length - 1 ? lastNameInputRef : null}
                value={param.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                disabled={!param.enabled}
              />
            </TableCell>
            <TableCell>
              <Input
                ref={
                  index === queryParams.length - 1 ? lastValueInputRef : null
                }
                value={param.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                disabled={!param.enabled}
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
              placeholder="Add new parameter"
            />
          </TableCell>
          <TableCell>
            <Input value="" disabled />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
