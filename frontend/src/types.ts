import { request } from "./lib/wailsjs/go/models"

export type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain"

export type MultipartFormdataValInfo = {
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

export type NameValuePair = {
  name: string
  value: string
}

export type CRequest = {
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

export type CResponse = request.Response & {
  /**
   * Base64 String
   */
  body: string
  decodedBody: string
}
