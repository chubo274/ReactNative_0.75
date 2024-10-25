import { AxiosResponse } from 'axios'
import { setTokenUser } from 'shared/helpers/function'
import ApiGateway from 'src/data/api'
import { urls } from 'src/data/api/resource'
import { UserModel } from 'src/models/user/UserModel'
import ZustandPersist, { ISessionStorage } from 'src/zustand/persist'

/**
 * Always store token in session storage for faster retrieve
 * @type {{token: string}}
 */

export const refreshTokenRepo = async (): Promise<AxiosResponse<boolean>> => {
  const resource = urls.refreshToken
  const refresh_token = ZustandPersist.getState()?.get('Token')?.refreshToken

  return ApiGateway.execute({
    method: 'POST',
    resource,
    body: { refresh_token: refresh_token }
  }).then(async response => {
    if (response.data) {
      response.data = UserModel.parseFromJson(response.data)
    }
    const token: ISessionStorage = { token: response?.data?.token, refreshToken: response?.data?.refreshToken }
    setTokenUser(token)
    return response
  })
}
