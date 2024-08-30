import { NameValuePair } from "@/types"

type JSON = string

export type TRequest = {
  url: string
  method: string
  headers: NameValuePair[]
  queryParams: NameValuePair[]
} & (
  | { body?: undefined; contentType?: undefined }
  | { body: JSON; contentType: "application/json" }
  | { body: NameValuePair[]; contentType: "application/x-www-form-urlencoded" }
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: any
      contentType: "multipart/form-data"
    }
)

export type TResponse = {
  /**
   * Base64 String
   */
  body: string
  contentType: string
  statusCode: number
  size: number
  headers: Record<string, string[]>
  durationMs: number
}

export type TResponseWithDecodedBody = TResponse & {
  decodedBody: string
}
