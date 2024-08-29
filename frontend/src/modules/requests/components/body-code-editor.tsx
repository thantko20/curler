import CodeMirror, { Extension } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { useMemo } from "react"

type Props = {
  value: string
  language: "json" | "text"
  onChange: (value: string) => void
}

export const BodyCodeEditor = ({ value, onChange, language }: Props) => {
  const extensions = useMemo(() => {
    const result: Extension[] = []
    if (language === "json") {
      result.push(json())
    }
    return result
  }, [language])
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      minHeight="100px"
    />
  )
}
