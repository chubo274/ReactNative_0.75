import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AppState, AppStateStatus, Linking, Platform } from 'react-native';
import { check, checkNotifications, NotificationsResponse, PERMISSIONS, PermissionStatus, request, requestNotifications } from 'react-native-permissions';
import { useGetPersist, useSavePersist } from 'src/zustand/persist';

export const useRequestNoti = () => {
  const notiStateRef = useRef<NotificationsResponse | undefined>();

  const onGranted = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      console.info('token: ', token);
    } catch (error) {
      console.error('fcm error: ', error);
    }
  }, []);

  // rule store: not ask again if user reject
  const checking = useCallback(async () => {
    if (notiStateRef.current?.status !== 'granted') {
      const newState = await requestNotifications(['alert']);
      notiStateRef.current = newState;
    } else {
      onGranted();
    }
  }, [onGranted]);

  useEffect(() => {
    checkNotifications().then((value) => {
      notiStateRef.current = value;
    });
  }, []);

  // run in when app change state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && notiStateRef.current?.status !== 'granted') {
        checkNotifications().then((checkRes) => {
          if (checkRes.status === 'granted') {
            onGranted();
          }
        });
      }
    });
    return () => {
      subscription.remove();
    };
  }, [onGranted]);

  return { checking };
};

export const useRequestPermission = (permissionName: 'Library' | 'Camera') => {
  const { t } = useTranslation();
  const statePermissionRef = useRef<boolean>(false);
  const checkAsked = useGetPersist('PermissionAsked');
  const save = useSavePersist();

  const permissionObj = useMemo(() => {
    switch (permissionName) {
      case 'Camera':
        return {
          title: t('askCameraTitle'),
          message: t('askCameraMessage'),
          name: Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
        };
      case 'Library':
      default:
        return {
          title: t('askLibraryTitle'),
          message: t('askLibraryMessage'),
          name: Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        };
    }
  }, [permissionName, t]);

  const permissionPass = useCallback((status: PermissionStatus) => ['granted', 'limited'].includes(status), []);

  const checking = useCallback(async () => {
    const value = await check(permissionObj.name);
    if (!permissionPass(value)) {
      // ask again
      if (Platform.OS === 'ios' && Boolean(checkAsked?.[permissionName])) {
        Alert.alert(permissionObj.title, permissionObj.message, [
          { onPress: Linking.openSettings, text: t('gotoSetting'), isPreferred: true },
          { text: t('cancel') },
        ]);
      }
      const requestValue = await request(permissionObj.name);
      statePermissionRef.current = permissionPass(requestValue);
      await save('PermissionAsked', { ...checkAsked, [permissionName]: true });
      return statePermissionRef.current;
    } else {
      statePermissionRef.current = true;
      return true;
    }
  }, [permissionObj, t, permissionPass, checkAsked, save, permissionName]);

  // Run when app changes state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state: AppStateStatus) => {
      if (state === 'active' && !statePermissionRef.current) {
        const checkRes = await checkNotifications();
        if (permissionPass(checkRes.status)) {
          statePermissionRef.current = true;
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, [permissionPass]);

  return checking;
};
