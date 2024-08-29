import { NameValuePair } from "@/types"

export type TRequest = {
  url: string
  method: string
  headers: NameValuePair[]
  queryParams: NameValuePair[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  contentType?: string
}

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
