import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { parseFormData } from 'shared/helpers/function'
import AuthenticationInterceptor from './interceptor/AuthenticationInterceptor'
import DefaultInterceptor from './interceptor/DefaultAppInterceptor'
import { RetryInterceptor } from './interceptor/RetryInterceptor'
import { baseUrl } from './resource'
import ZustandPersist from 'src/zustand/persist'

export type HTTPMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'POSTFORM'

interface IConfigRequest {
  method: HTTPMethod
  resource: string
  isFormDataType?: boolean
  body?: any
  params?: any
  queryParams?: any
}
class ApiGateway {
  _instanceAxios = axios.create()
  configTimeout = 60 * 1000
  requestConfig!: AxiosRequestConfig

  constructor() {
    this._addDefaultInterceptors()
    this._addInterceptors()
  }

  private readonly _addDefaultInterceptors = () => {
    const authenticationInterceptor = new AuthenticationInterceptor()
    this._instanceAxios.interceptors.request.use(authenticationInterceptor.requestFulfilled)

    const defaultInterceptor = new DefaultInterceptor()
    this._instanceAxios.interceptors.request.use(
      defaultInterceptor.requestFulfilled,
      defaultInterceptor.requestReject
    );
    this._instanceAxios.interceptors.response.use(
      defaultInterceptor.responseFulfilled,
      defaultInterceptor.responseReject
    );

    const retryInterceptor = new RetryInterceptor(this._instanceAxios)
    this._instanceAxios.interceptors.response.use(
      retryInterceptor.responseFulfilled,
      retryInterceptor.responseReject
    );
  }

  private readonly _addInterceptors = () => {
    // some expand interceptors default can be add here!
  }

  execute = (config: IConfigRequest) => {
    const { method, resource, body, isFormDataType, params, queryParams } = config
    // const { token } = ZustandPersist.getState().get('Token') ?? {}
    const headers = {
      'Accept': 'application/json',
      'Content-Type': isFormDataType ? 'multipart/form-data' : 'application/json', // Content-Type = 'application/json' == null
      'sw-access-key': 'SWSCRUDICUUXCTDTDHHKRWW1NA',
      'Authorization':  '',
    }
    // headers['Authorization'] = token || ''
    const url = queryParams ? resource + queryParams : resource
    let data = body
    if (isFormDataType) { data = parseFormData(body) }
    if (method == 'GET') { data = undefined }

    const configRequest: AxiosRequestConfig<any> = {
      baseURL: baseUrl.value,
      timeout: this.configTimeout,
      headers,
      url,
      method,
      params,
      paramsSerializer: {
        encode: (params: any) => qs.stringify(params, {
          skipNulls: true,
          arrayFormat: 'brackets'
        })
      },
      data
    }

    switch (method) {
      case 'DELETE':
        return this._instanceAxios.delete(resource, configRequest)
      case 'GET':
        return this._instanceAxios.get(resource, configRequest)
      case 'PATCH':
        return this._instanceAxios.patch(resource, data, configRequest)
      case 'POST':
        return this._instanceAxios.post(resource, data, configRequest)
      case 'PUT':
        return this._instanceAxios.put(resource, data, configRequest)
      case 'POSTFORM':
        return this._instanceAxios.postForm(resource, data, configRequest)

      default:
        // @ts-ignore
        const error: AxiosResponse = { data: undefined, status: 400, statusText: '400', headers: headers, config: configRequest }
        return Promise.resolve(error)
    }
  };
}

export default new ApiGateway()
