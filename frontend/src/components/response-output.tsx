import { CResponse } from "@/types"
import { useCodeMirror } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { cn } from "@/lib/utils/cn"
import { useEffect, useRef } from "react"
import { SearchCursor } from "@codemirror/search"

type Props = {
  response: CResponse
  className?: string
  width?: string
  height?: string
}

const extensions = [json()]

export const ResponseOutput = ({
  response,
  className,
  width,
  height
}: Props) => {
  const editor = useRef<HTMLDivElement>(null)
  const { setContainer, state } = useCodeMirror({
    container: editor.current,
    extensions,
    value: JSON.stringify(JSON.parse(response.decodedBody), null, 2),
    editable: false,
    className: cn(className),
    width,
    height
  })
  useEffect(() => {
    setContainer(editor.current)
  }, [setContainer])
  useEffect(() => {
    if (response.contentType.startsWith("application/json") && state) {
      const cursor = new SearchCursor(state.doc, "products")
      cursor.next()
      console.log(cursor.value)
    }
  }, [response.body, response.contentType, state])
  // function generateImageUrlFromBinaryString(input: string) {
  //   const byteArray = new Uint8Array(input.length)
  //   for (let i = 0; i < input.length; i++) {
  //     byteArray[i] = input.charCodeAt(i)
  //   }
  //   const blob = new Blob([byteArray], { type: response.contentType })
  //   return URL.createObjectURL(blob)
  // }
  return response.contentType.startsWith("application/json") ? (
    <div ref={editor} />
  ) : (
    <pre>{response.decodedBody}</pre>
  )
}
