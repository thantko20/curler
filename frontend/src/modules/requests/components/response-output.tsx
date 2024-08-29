import { CResponse } from "@/types"
import { useCodeMirror } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { cn } from "@/lib/utils/cn"
import { useEffect, useMemo, useRef } from "react"

type Props = {
  response: CResponse
  className?: string
  width?: string
  /**
   * View Height
   *
   * Set the container height via className
   */
  height?: string
}

const extensions = [json()]

export const ResponseOutput = ({
  response,
  className,
  width,
  height = "100%"
}: Props) => {
  const value = useMemo(() => {
    if (response.contentType.startsWith("application/json")) {
      return JSON.stringify(JSON.parse(response.decodedBody), null, 2)
    }
    return response.decodedBody
  }, [response.decodedBody, response.contentType])
  const editor = useRef<HTMLDivElement>(null)
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions,
    value,
    editable: false,
    width,
    height
  })

  useEffect(() => {
    setContainer(editor.current)
  }, [setContainer])

  return response.contentType.startsWith("application/json") ? (
    <div ref={editor} className={cn(className)} />
  ) : (
    <pre>{response.decodedBody}</pre>
  )
}
