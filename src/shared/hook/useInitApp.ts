import { StackActions } from '@react-navigation/native'
import { useCallback, useRef } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { useContext } from 'src/data/hooks/context/useContext'
import { backToTopAppStack } from 'src/modules/navigation'
import ZustandPersist, { useGetPersist } from 'src/zustand/persist'
import { EmitType } from '../helpers/constant'
import NavigationService from '../helpers/NavigationService'

export const useInitApp = () => {
  const { token } = useGetPersist('Token') ?? {}
  const { token: tokenContext } = ZustandPersist.getState().get('Context') ?? {}
  const refInitIsDone = useRef<boolean>(false);  // to make sure this hook run only one time
  const { fetch: getContext, error: getContextErr } = useContext();
  const isOnboard = ZustandPersist.getState()?.get('isOnboard')

  // export to use in other place
  const promiseInitBeforeLogin = useCallback(async () => {
    if (!tokenContext) {
      await getContext()
      if (getContextErr) {
        console.error('init api got Error Before Login at ', 'getContext');
        return false
      }
    }

    const listInitApi = await Promise.all([]);
    const indexApiGetError = listInitApi.findIndex((el: boolean) => el === false);
    if (indexApiGetError != -1) {
      console.error('init api got Error Before Login at ', indexApiGetError);
      return false
    }
    return true
  }, [getContext, getContextErr, tokenContext])

  const promiseInitAfterLogin = useCallback(async () => {
    const listInitApi = await Promise.all([]);
    const indexApiGetError = listInitApi.findIndex((el: boolean) => el === false);
    if (indexApiGetError != -1) {
      console.error('init api got Error After Login at ', indexApiGetError);
      return false
    }
    return true
  }, [])

  const initStateApp = useCallback(async () => {
    if (!refInitIsDone.current) {
      refInitIsDone.current = true;
      // api befor login
      const before = await promiseInitBeforeLogin();
      if (!before) return;
      // api after login
      if (token) {
        const after = await promiseInitAfterLogin();
        if (!after) return;
      }
      // check onboarding
      if (!isOnboard) {
        NavigationService.topLevelNavigator?.dispatch(StackActions.replace('OnBoardingStack'))
      } else {
        backToTopAppStack()
      }
      DeviceEventEmitter.emit(EmitType.InitializeReady);
      return
    }
  }, [promiseInitBeforeLogin, promiseInitAfterLogin, token, isOnboard])

  return { initStateApp, promiseInitBeforeLogin, promiseInitAfterLogin }
}
