import * as walisApi from "@/lib/wailsjs/go/main/App"
import { TRequest, TResponse } from "./types"
import { request } from "@/lib/wailsjs/go/models"

export const sendRequest = async (request: TRequest): Promise<TResponse> => {
  return walisApi.Send(request as request.Request)
}
