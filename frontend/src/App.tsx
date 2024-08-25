import { useReducer, useState } from "react"
import { Button } from "./components/ui/button"
import { Send } from "./lib/wailsjs/go/main/App"
import { request } from "./lib/wailsjs/go/models"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./components/ui/select"
import { Input } from "./components/ui/input"
import { CRequest, CResponse } from "./types"
import { ResponseOutput } from "./components/response-output"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Action =
  | {
      type: "UPDATE_URL"
      payload: string
    }
  | {
      type: "UPDATE_METHOD"
      payload: string
    }

function cRequestReducer(state: CRequest, action: Action): CRequest {
  switch (action.type) {
    case "UPDATE_URL":
      return { ...state, url: action.payload }
    case "UPDATE_METHOD":
      return { ...state, method: action.payload }
    default:
      return state
  }
}

function App() {
  const [req, dispatch] = useReducer(cRequestReducer, {
    url: "https://dummyjson.com/products",
    method: "GET",
    headers: [],
    queryParams: []
  })

  const [res, setRes] = useState<CResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendRequest() {
    setError(null)
    setIsLoading(true)
    try {
      const myRequest = new request.Request()
      myRequest.url = req.url
      myRequest.method = req.method
      myRequest.headers = req.headers
      myRequest.queryParams = req.queryParams
      myRequest.body = req.body

      const result = await Send(myRequest)
      const decodedBody = atob(result.body)
      console.log({ decodedBody, result })
      setRes({ ...result, decodedBody })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const [tab, setTab] = useState("query-params")

  return (
    <div className="p-4 flex flex-col h-screen">
      <div className="flex-shrink-0">
        <RequestTopSection
          url={req.url}
          method={req.method}
          isLoading={isLoading}
          onClickSend={sendRequest}
          onMethodChange={(value) =>
            dispatch({ type: "UPDATE_METHOD", payload: value })
          }
          onUrlChange={(value) =>
            dispatch({ type: "UPDATE_URL", payload: value })
          }
        />
      </div>
      {isLoading ? <div>Loading...</div> : null}
      {error ? <div>{error}</div> : null}
      <div className="h-full">
        <Tabs className="w-[400px]" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="query-params">Params</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>
        </Tabs>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <Tabs value={tab}>
              <TabsContent value="query-params">query params</TabsContent>
              <TabsContent value="body">body</TabsContent>
              <TabsContent value="headers">headers</TabsContent>
              <TabsContent value="auth">auth</TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={10}>
            {res ? (
              <ResponseOutput response={res} className="mt-4 h-full" />
            ) : null}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App

type TopSectionProps = {
  url: string
  method: string
  onClickSend: () => void
  onMethodChange: (method: string) => void
  onUrlChange: (url: string) => void
  isLoading?: boolean
}

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const

function RequestTopSection(props: TopSectionProps) {
  const {
    url,
    method,
    onClickSend,
    onMethodChange,
    onUrlChange,
    isLoading = false
  } = props
  return (
    <div className="flex gap-2">
      <Select onValueChange={onMethodChange} value={method}>
        <SelectTrigger className="max-w-28">
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent>
          {httpMethods.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <form
        className="flex gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault()
          onClickSend()
        }}
      >
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.currentTarget.value)}
        />
        <Button type="submit" className="min-w-24" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  )
}
