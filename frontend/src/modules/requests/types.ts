import { NameValuePair } from "@/types"

type JSON = string

export type TRequest = {
  url: string
  method: string
  headers: NameValuePair[]
  queryParams: NameValuePair[]
  /**
   * JSON format
   */
  body?: JSON
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
