import { getPokemon } from './getPokemon'
import { loginRepo } from './loginRepo'
import { logoutRepo } from './logoutRepo'
import { refreshTokenRepo } from './refreshTokenRepo'

export const UserRepository = {
  logoutRepo,
  loginRepo,
  refreshTokenRepo,
  getPokemon,
}
