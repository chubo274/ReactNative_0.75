import { ActionStatus } from 'shared/helpers/constant'
import { IMeta } from './IPagination'

// model & interface for redux

export type IDictionary<T> = Record<string, T>

export interface IActionCallBacks {
    onSuccess?: (data?: any) => void
    onFailed?: (error?: string) => void

    [key: string]: any
}

export interface IActionParams<T> {
    request?: T
    sectionId?: string | number
    isAppend?: boolean
    canLoadMore?: boolean | IDictionary<boolean>

    [key: string]: any
}

export interface IAction<T> {
    type: string
    payload?: T
    params?: IActionParams<any>
    error?: any
    callBacks?: IActionCallBacks

    [key: string]: any
}

export interface IReducer<T> {
    isFetching: boolean
    status: ActionStatus
    data?: T
    canLoadMore?: boolean | IDictionary<boolean>
    params?: IActionParams<any>
    errorMessage?: string
    error?: any
    actionType: string
    success: boolean
}

export class ResponseModel<T> {
  status: number
  statusText: string
  data: T
  isError: boolean
  request?: any
  headers: any
  config: any
  message?: string
  rawError?: any
  response?: any
  meta?: IMeta

  constructor(
    status: number,
    statusText: string,
    data: T,
    isError = false
  ) {
    this.status = status
    this.statusText = statusText
    this.data = data
    this.isError = isError
  }

  static createSuccess(res: any): ResponseModel<any> {
    const response = new ResponseModel(200, '200', undefined)
    response.status = res.status
    response.statusText = res.statusText
    response.data = res.data
    response.isError = false
    response.request = res.request
    response.headers = res.headers
    response.config = res.config
    return response
  }

  static createError(
    status: number,
    statusText: string,
    message?: string,
    rawError?: any,
    request?: any,
    config?: any,
    responseError?: any,
  ): ResponseModel<any> {
    const response = new ResponseModel(0, '', undefined)
    response.status = status
    response.statusText = statusText
    response.isError = true
    response.message = message
    response.rawError = rawError
    response.request = request
    response.config = config
    response.response = responseError
    return response
  }
}
// model & interface for
