import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
export default abstract class Interceptor {

    abstract requestFulfilled(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig

    abstract requestReject(error: any): any

    abstract responseFulfilled(response: AxiosResponse): any

    abstract responseReject(error: any): Promise<any>
}
