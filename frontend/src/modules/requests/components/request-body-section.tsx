import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { TRequest } from "../types"
import { BodyCodeEditor } from "./body-code-editor"
import { KeyValueTable } from "./key-value-table"
import { useRequest } from "../use-request"

const textContentTypes = ["text/plain", "application/json"]

function textContentTypeToLanguage(contentType: string) {
  switch (contentType) {
    case "text/plain":
    default:
      return "text"
    case "application/json":
      return "json"
  }
}

type Props = {
  request: TRequest
  onBodyChange: ReturnType<typeof useRequest>["updateBody"]
  onBodyTypeChange: (value: string) => void
}

export const RequestBodySection = ({
  request,
  onBodyChange,
  onBodyTypeChange
}: Props) => {
  return (
    <div className="space-y-2">
      <Select
        defaultValue="none"
        value={request.contentType || "none"}
        onValueChange={onBodyTypeChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue
            placeholder="Form Type"
            className="placeholder:text-gray-400"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="application/json">JSON</SelectItem>
          <SelectItem value="text/plain">Raw</SelectItem>
          <SelectItem value="application/x-www-form-urlencoded">
            URL Encoded Form
          </SelectItem>
          <SelectItem value="multipart/form-data">Multipart Form</SelectItem>
        </SelectContent>
      </Select>
      {textContentTypes.includes(request.contentType ?? "") ? (
        <BodyCodeEditor
          value={request.body || ""}
          language={textContentTypeToLanguage(request.contentType ?? "")}
          onChange={onBodyChange}
        />
      ) : null}
      {request.contentType === "application/x-www-form-urlencoded" ? (
        <KeyValueTable
          items={request.body || []}
          onItemChange={(index, pair) => {
            console.log({ index, pair })
            onBodyChange(pair, index)
          }}
        />
      ) : null}
      {request.contentType === "multipart/form-data" ? (
        <KeyValueTable items={request.body || []} onItemChange={() => {}} />
      ) : null}
    </div>
  )
}
