import ApiGateway from 'src/data/api'
import { urls } from 'src/data/api/resource'
import { UserModel } from 'src/models/user/UserModel'
import { AxiosResponse } from 'axios'

/**
 * Always store token in session storage for faster retrieve
 * @type {{token: string}}
 */


export const getPokemon = async (): Promise<AxiosResponse<UserModel>> => {
  const resource = urls.ditto
    
  return ApiGateway.execute({
    method: 'GET',
    resource,
  }).then(async response => {
    return response
  })
}
