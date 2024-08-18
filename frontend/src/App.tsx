import { useState } from "react"
import { Button } from "./components/ui/button"
import { Send } from "./lib/wailsjs/go/main/App"
import { request } from "./lib/wailsjs/go/models"

type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain"

type MultipartFormdataValInfo = {
  value: string
} & (
  | {
      valueType: "text"
      filename?: never
      mimeType?: string
    }
  | {
      valueType: "file"
      filename: string
      mimeType: string
    }
)

type NameValuePair = {
  name: string
  value: string
}

type MyRequest = {
  url: string
  method: string
  headers: NameValuePair[]
  queryParams: NameValuePair[]
} & (
  | {
      contentType: Extract<ContentType, "application/json">
      body: string
    }
  | {
      contentType: Extract<ContentType, "multipart/form-data">
      body: Record<string, MultipartFormdataValInfo>
    }
  | {
      contentType: Extract<ContentType, "application/x-www-form-urlencoded">
      body: NameValuePair[]
    }
  | {
      contentType?: undefined
      body?: unknown
    }
)

type MyResponse = request.Response & {
  decodedBody: string
}

function App() {
  const [req] = useState<MyRequest>({
    url: "https://dummyjson.com/product",
    method: "GET",
    headers: [],
    queryParams: []
  })

  const [res, setRes] = useState<MyResponse | null>(null)

  function sendRequest() {
    const myRequest = new request.Request()
    myRequest.url = req.url
    myRequest.method = req.method
    myRequest.headers = req.headers
    myRequest.queryParams = req.queryParams
    myRequest.body = req.body

    Send(myRequest)
      .then((result) => setRes({ ...result, decodedBody: atob(result.body) }))
      .catch(console.error)
  }

  function generateImageUrlFromBinaryString(input: string) {
    if (!res) return ""
    const byteArray = new Uint8Array(input.length)
    for (let i = 0; i < input.length; i++) {
      byteArray[i] = input.charCodeAt(i)
    }
    const blob = new Blob([byteArray], { type: res.contentType })
    return URL.createObjectURL(blob)
  }

  return (
    <>
      <Button onClick={sendRequest}>Click Me</Button>
      {res?.contentType.startsWith("image/") ? (
        <img src={generateImageUrlFromBinaryString(res.decodedBody)} />
      ) : null}
      {res?.contentType.startsWith("application/json") ? (
        <pre>{JSON.stringify(JSON.parse(res.decodedBody), null, 2)}</pre>
      ) : null}
    </>
  )
}

export default App
