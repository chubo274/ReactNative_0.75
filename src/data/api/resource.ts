export const enum HostApi {
    HostDev = '',
    HostStg = 'https://pokeapi.co/api/v2/',
    HostProduct = 'HostProduct',
}

export const baseUrl = {
  value: HostApi.HostStg
}

export const buildMode = {
  modeDev: true
}

export const urls = {
  ditto: 'pokemon/ditto',
  login: 'fakeGetUser',
  logout: 'fakeGetUser',
  refreshToken: 'fakeGetUser',
}
