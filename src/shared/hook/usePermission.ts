import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AppState, AppStateStatus, Linking, Platform } from 'react-native';
import { check, checkNotifications, NotificationsResponse, PERMISSIONS, PermissionStatus, request, requestNotifications } from 'react-native-permissions';
import { useGetPersist, useSavePersist } from 'src/zustand/persist';

export const useRequestNoti = () => {
  const [notiState, setNotiState] = useState<NotificationsResponse | undefined>()

  const onGranted = useCallback(async () => {
    const token = await messaging().getToken()
    console.info('token', token);
  }, [])

  // rule store: not ask again if user reject
  const checking = useCallback(async () => {
    if (notiState?.status != 'granted') {
      setNotiState(await requestNotifications(['alert']))
    } else {
      onGranted()
    }
  }, [onGranted, notiState?.status])

  useEffect(() => {
    checkNotifications().then((value) => {
      setNotiState(value)
    })
  }, [])

  // run in when app change sate
  useEffect(() => {
    const subcription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state == 'active' && notiState?.status != 'granted') {
        // when app change state call total api again
        checkNotifications().then((checkRes) => {
          if (checkRes.status == 'granted') {
            onGranted();
          }
        })
      }
    })
    return (() => {
      subcription.remove()
    })
  }, [onGranted, notiState?.status])

  return { checking }
}

export const useRequestPermission = (permissionName: 'Library' | 'Camera') => {
  const { t } = useTranslation()
  const [satePermission, setStatePermission] = useState(false)
  const checkAsked = useGetPersist('PermissionAsked')
  const save = useSavePersist()

  const permissionObj = useMemo(() => {
    switch (permissionName) {
      case 'Camera':
        return {
          title: t('askCameraTitle'),
          message: t('askCameraMessage'),
          name: Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
        }
      case 'Library':
      default:
        return {
          title: t('askLibraryTitle'),
          message: t('askLibraryMessage'),
          name: Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        }
    }
  }, [permissionName, t])

  const permissionPass = useCallback((status: PermissionStatus) => { return ['granted', 'limited'].includes(status) }, [])

  const checking = useCallback(() => {
    return check(permissionObj.name).then((value: PermissionStatus) => {
      if (!permissionPass(value)) {
        // ask again
        if (Platform.OS == 'ios' && Boolean(checkAsked?.[permissionName])) Alert.alert(permissionObj.title, permissionObj.message, [{ onPress: Linking.openSettings, text: t('gotoSetting'), isPreferred: true }, { text: t('cancel') }]);
        return request(permissionObj.name).then((value) => {
          // ask again value 
          setStatePermission(permissionPass(value))
          return permissionPass(value)
        })
          .finally(() => save('PermissionAsked', { ...checkAsked, [permissionName]: true }))
      } else {
        // granted
        setStatePermission(true)
        return true
      }
    })
  }, [permissionObj, t, permissionPass, checkAsked, save])

  // run in when app change sate
  useEffect(() => {
    const subcription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state == 'active' && !satePermission) {
        // when app change state call total api again
        checkNotifications().then((checkRes) => {
          if (permissionPass(checkRes.status)) setStatePermission(true)
        })
      }
    })
    return (() => {
      subcription.remove()
    })
  }, [satePermission, permissionPass])

  return checking
}
