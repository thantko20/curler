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
      payload: string
    }
  | {
      type: "UPDATE_BODY_TYPE"
      payload: string
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
      return {
        ...state,
        body: action.payload
      }
    }
    case "UPDATE_BODY_TYPE": {
      return {
        ...state,
        contentType: action.payload
      }
    }
    default:
      return state
  }
}

export function useRequest(initialState: TRequest) {
  const [state, dispatch] = useReducer(requestReducer, initialState)

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

  const updateBody = (value: string) =>
    dispatch({ type: "UPDATE_BODY", payload: value })

  return {
    request: state,
    updateUrl,
    updateMethod,
    updateKVPair,
    updateBody,
    dispatch
  }
}
