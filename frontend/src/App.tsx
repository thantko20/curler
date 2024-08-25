import { useState } from "react"
import { Button } from "./components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./components/ui/select"
import { Input } from "./components/ui/input"
import { ResponseOutput } from "./modules/requests/components/response-output"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sendRequest } from "./modules/requests/api"
import { TResponseWithDecodedBody } from "./modules/requests/types"
import { useRequest } from "./modules/requests/use-request"
import { KeyValueTable } from "./modules/requests/components/key-value-table"

function App() {
  const {
    request: req,
    updateUrl,
    updateMethod,
    updateKVPair
  } = useRequest({
    url: "https://dummyjson.com/products",
    method: "GET",
    headers: [],
    queryParams: []
  })

  const [res, setRes] = useState<TResponseWithDecodedBody | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSendRequest() {
    setError(null)
    setIsLoading(true)
    try {
      const result = await sendRequest(req)
      const decodedBody = atob(result.body)
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
          onClickSend={onSendRequest}
          onMethodChange={(value) => updateMethod(value)}
          onUrlChange={(value) => updateUrl(value)}
        />
      </div>
      {isLoading ? <div>Loading...</div> : null}
      {error ? <div>{error}</div> : null}
      <div className="h-full">
        <Tabs className="w-[400px]" value={tab} onValueChange={setTab}>
          <TabsList className="mt-4">
            <TabsTrigger value="query-params">Params</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>
        </Tabs>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <Tabs value={tab}>
              <TabsContent value="query-params">
                <KeyValueTable
                  items={req.queryParams}
                  onItemChange={updateKVPair.bind(null, "queryParams")}
                />
              </TabsContent>
              <TabsContent value="body">body</TabsContent>
              <TabsContent value="headers">
                <KeyValueTable
                  items={req.headers}
                  onItemChange={updateKVPair.bind(null, "headers")}
                />
              </TabsContent>
              <TabsContent value="auth">auth</TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="py-4">
            {res ? <ResponseOutput response={res} className="h-full" /> : null}
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
