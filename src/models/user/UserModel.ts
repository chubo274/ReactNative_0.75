export class UserModel {
  tokenType: string
  token: string
  refreshToken?: string

  constructor(token: string) {
    this.token = token
    this.tokenType = 'Bearer'
  }

  static parseFromJson = (data: any) => {
    const obj = new UserModel('')
    const { token_type, access_token, refresh_token } = data

    if (token_type && access_token) {
      obj.token = `${token_type} ${access_token}`
    }
    if (token_type && access_token) {
      obj.refreshToken = refresh_token
    }

    return obj
  }
}
