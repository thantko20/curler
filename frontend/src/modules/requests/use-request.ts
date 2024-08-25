// projects/curler/frontend/src/modules/requests/use-request.ts

import { useReducer } from "react"
import { NameValuePair } from "@/types"
import { TRequest } from "./types"

type Action =
  | {
      type: "UPDATE_URL"
      payload: string
    }
  | {
      type: "UPDATE_METHOD"
      payload: string
    }
  | {
      type: "UPDATE_PARAMS"
      payload: {
        index: number | null
        param: NameValuePair
      }
    }

function requestReducer(state: TRequest, action: Action): TRequest {
  switch (action.type) {
    case "UPDATE_URL":
      return { ...state, url: action.payload }
    case "UPDATE_METHOD":
      return { ...state, method: action.payload }
    case "UPDATE_PARAMS": {
      const { index, param } = action.payload
      if (index === null) {
        return { ...state, queryParams: [...state.queryParams, param] }
      }
      if (param.name || param.value) {
        return {
          ...state,
          queryParams: [
            ...state.queryParams.slice(0, index),
            param,
            ...state.queryParams.slice(index + 1)
          ]
        }
      }

      // remove the param
      return {
        ...state,
        queryParams: [
          ...state.queryParams.slice(0, index),
          ...state.queryParams.slice(index + 1)
        ]
      }
    }
    default:
      return state
  }
}

export function useRequest(initialState: TRequest) {
  return useReducer(requestReducer, initialState)
}
