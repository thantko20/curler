import * as walisApi from "@/lib/wailsjs/go/main/App"
import { TRequest, TResponse } from "./types"
import { request } from "@/lib/wailsjs/go/models"

export const sendRequest = async (request: TRequest): Promise<TResponse> => {
  const clonedRequest = structuredClone(request)

  if (
    clonedRequest.contentType === "multipart/form-data" ||
    clonedRequest.contentType === "application/x-www-form-urlencoded"
  ) {
    clonedRequest.body = JSON.stringify(clonedRequest.body)
  }

  return walisApi.Send(clonedRequest as request.Request)
}
