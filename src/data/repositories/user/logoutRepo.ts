import { AxiosResponse } from 'axios'
import ApiGateway from 'src/data/api'
import { urls } from 'src/data/api/resource'
import { ResponseModel } from 'src/models/common'
import { backToTopAuthStack } from 'src/modules/navigation'
import ZustandPersist from 'src/zustand/persist'

/**
 * Always store token in session storage for faster retrieve
 * @type {{token: string}}
 */

export const logoutRepo = async (isForceLogout?: boolean): Promise<AxiosResponse<boolean>> => {
  const resource = urls.logout

  if (isForceLogout) {
    return ResponseModel.createSuccess({ status: 200, statusText: '200', data: true, })
  }

  return ApiGateway.execute({
    method: 'DELETE',
    resource,
  }).then(async response => {
    if (response.data) {
      response.data = true
    }
    return response;
  }).finally(() => {
    ZustandPersist.getState()?.save('Token', {})
    setTimeout(() => {
      backToTopAuthStack()
    }, 300);
  })
}
