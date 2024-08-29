// projects/curler/frontend/src/modules/requests/use-request.ts

import { useReducer } from "react"
import { NameValuePair } from "@/types"
import { TRequest } from "./types"

type UpdateKVPairAction = {
  type: "UPDATE_KV_PAIR"
  payload: {
    field: "queryParams" | "headers"
    index: number | null
    item: NameValuePair
  }
}

type Action =
  | {
      type: "UPDATE_URL"
      payload: string
    }
  | {
      type: "UPDATE_METHOD"
      payload: string
    }
  | UpdateKVPairAction
  | {
      type: "UPDATE_BODY"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: { contentType: string; value: any }
    }

function requestReducer(state: TRequest, action: Action): TRequest {
  switch (action.type) {
    case "UPDATE_URL":
      return { ...state, url: action.payload }
    case "UPDATE_METHOD":
      return { ...state, method: action.payload }
    case "UPDATE_KV_PAIR": {
      const { field, index, item } = action.payload
      const currentItems = state[field]

      if (index === null) {
        return { ...state, [field]: [...currentItems, item] }
      }

      if (item.name || item.value) {
        return {
          ...state,
          [field]: [
            ...currentItems.slice(0, index),
            item,
            ...currentItems.slice(index + 1)
          ]
        }
      }

      // remove the item
      return {
        ...state,
        [field]: [
          ...currentItems.slice(0, index),
          ...currentItems.slice(index + 1)
        ]
      }
    }
    case "UPDATE_BODY": {
      const { contentType, value } = action.payload
      return {
        ...state,
        body: value,
        contentType
      }
    }
    default:
      return state
  }
}

export function useRequest(initialState: TRequest) {
  const [request, dispatch] = useReducer(requestReducer, initialState)

  const updateUrl = (url: string) =>
    dispatch({ type: "UPDATE_URL", payload: url })

  const updateMethod = (method: string) =>
    dispatch({ type: "UPDATE_METHOD", payload: method })

  const updateKVPair = (
    field: "queryParams" | "headers",
    index: number | null,
    item: NameValuePair
  ) =>
    dispatch({
      type: "UPDATE_KV_PAIR",
      payload: { field, index, item }
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBody = (contentType: string, value: any) =>
    dispatch({ type: "UPDATE_BODY", payload: { contentType, value } })

  return {
    request,
    updateUrl,
    updateMethod,
    updateKVPair,
    updateBody,
    dispatch
  }
}
