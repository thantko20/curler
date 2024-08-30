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

export type RequestStateAction =
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
      payload: any
    }
  | {
      type: "UPDATE_BODY_TYPE"
      payload: string
    }

function requestReducer(state: TRequest, action: RequestStateAction): TRequest {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contentType: action.payload as any,
        body:
          action.payload === "application/json" ||
          action.payload === "text/plain"
            ? ""
            : undefined
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

  function updateBody(value: string): void
  function updateBody(value: NameValuePair, index: number | null): void
  function updateBody(
    value: NameValuePair | string,
    index?: number | null
  ): void {
    if (state.contentType === "application/json" && typeof value === "string") {
      dispatch({ type: "UPDATE_BODY", payload: value as string })
    } else if (
      state.contentType === "application/x-www-form-urlencoded" &&
      typeof value !== "string"
    ) {
      console.log({ value, index })
      const currentItems = state.body || []

      if (index === null) {
        dispatch({ type: "UPDATE_BODY", payload: [...currentItems, value] })
      }

      index = index!

      if (value.name || value.value) {
        dispatch({
          type: "UPDATE_BODY",
          payload: [
            ...currentItems.slice(0, index),
            value,
            ...currentItems.slice(index + 1)
          ]
        })
      }

      dispatch({
        type: "UPDATE_BODY",
        payload: [
          ...currentItems.slice(0, index),
          ...currentItems.slice(index + 1)
        ]
      })
    }
    // dispatch({ type: "UPDATE_BODY", payload: value })
  }

  return {
    request: state,
    updateUrl,
    updateMethod,
    updateKVPair,
    updateBody,
    dispatch
  }
}
