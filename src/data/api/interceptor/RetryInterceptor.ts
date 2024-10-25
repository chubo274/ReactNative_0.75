import { logoutRepo } from 'src/data/repositories/user/logoutRepo'
import { refreshTokenRepo } from 'src/data/repositories/user/refreshTokenRepo'
import { ResponseModel } from 'src/models/common'
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { emitShowToast, setTokenUser } from 'shared/helpers/function'
import { getString } from 'shared/localization'
import { urls } from '../resource'
import Interceptor from './Interceptor'

type RefreshTokenCallback = (token: string, refreshToken?: string) => void

let isRefreshing = false
let isForceLogout = false
let refreshSubscribers: RefreshTokenCallback[] = []

export class RetryInterceptor extends Interceptor {
  axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    super()
    this.axiosInstance = axiosInstance
  }

  requestFulfilled = (config: InternalAxiosRequestConfig) => {
    return config
  };

  requestReject = async (error: any) => {
    return await Promise.reject(error)
  };

  responseFulfilled = (response: AxiosResponse) => {
    return response
  };

  responseReject = async (error: ResponseModel<any>) => {
    if (error.config?.url == urls.refreshToken && error.response.status == 422 && !isForceLogout) {
      isForceLogout = true
      isRefreshing = false
      logoutRepo(true).then((value) => {
        emitShowToast({ type: 'forceLogout', toastMessage: getString('tokenTimeout'), numberOfLines: 2 })
        setTimeout(() => {
          isForceLogout = false
        }, 2000);
      })
      return;
    }
    let status = 0
    if (error.response != null && !isForceLogout) {
      status = error.response.status
      if (status == 401) {

        const originalRequest = error.config ?? {}
        if (!isRefreshing) {
          isRefreshing = true
          // call api refreshToken:
          refreshTokenRepo().then((response: AxiosResponse) => {
            isRefreshing = false;
            onRefreshed(response?.data!.access_token, response?.data!.refresh_token);
          });
        }

        const retryOrigReq = new Promise((resolve, reject) => {
          const handler: RefreshTokenCallback = async (token, refreshToken) => {
            // replace the expired token and retry
            if ((originalRequest?.headers) == null) {
              originalRequest.headers = {}
            }
            originalRequest.headers.Authorization = `Bearer ${token}`
            setTokenUser({ token: token, refreshToken: refreshToken })

            resolve(this.axiosInstance.request(originalRequest))
          };
          subscribeTokenRefresh(handler)
        })
        return await retryOrigReq
      } else {
        return await Promise.reject(error)
      }
    }

    return await Promise.reject(error)
  };
}

const subscribeTokenRefresh = (cb: RefreshTokenCallback) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string, refreshToken?: string) => {
  refreshSubscribers.map(cb => cb(token, refreshToken))
  refreshSubscribers = []
}
