import * as walisApi from "@/lib/wailsjs/go/main/App"
import { TRequest, TResponse } from "./types"
import { request } from "@/lib/wailsjs/go/models"

export const sendRequest = async (request: TRequest): Promise<TResponse> => {
  const clonedRequest = JSON.parse(JSON.stringify(request)) as TRequest
  const params = new URLSearchParams(
    clonedRequest.queryParams
      .filter((pair) => pair.enabled)
      .map((pair) => [pair.name, pair.value])
  )
  const queryString = params.toString()
  clonedRequest.url += `?${queryString}`
  return walisApi.Send(clonedRequest as request.Request)
}
