import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { TRequest } from "../types"
import { BodyCodeEditor } from "./body-code-editor"

type Props = {
  request: TRequest
  onBodyChange: (value: string) => void
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
      {request.contentType === "application/json" ? (
        <BodyCodeEditor
          value={request.body || ""}
          language="json"
          onChange={onBodyChange}
        />
      ) : null}
    </div>
  )
}
