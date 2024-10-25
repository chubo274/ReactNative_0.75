import { UserRepository } from 'src/data/repositories/user';
import { AppText } from 'components/text/AppText';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { EmitType } from 'shared/helpers/constant';
import { ITheme, useAppTheme } from 'shared/theme';
import { globalShadowStyle } from 'shared/theme/globalStyle';

export interface IAppToast {
    type?: 'forceLogout'
    toastMessage?: string
    numberOfLines?: number
}

export const AppToast = React.memo((props: IAppToast) => {
  const { t } = useTranslation()
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const [showToast, setShowToast] = useState(false)
  const [toastConfig, setToastConfig] = useState<IAppToast>({})
  const { toastMessage = '', numberOfLines = 1 } = useMemo(() => toastConfig, [toastConfig])
  const isToast = useRef(false)

  const _emitShowToast = useCallback((params: any) => {
    if (!isToast.current) {
      isToast.current = true
      setShowToast(true)
      setToastConfig(params)
      setTimeout(() => {
        setShowToast(false)
        setToastConfig({})
        isToast.current = false
      }, 2000)
    }
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      EmitType.AppToast, (params: IAppToast) => {
        switch (params?.type) {
          case 'forceLogout':
            UserRepository.logoutRepo();
            _emitShowToast(params)
            break;
          default:
            _emitShowToast(params)
            break;
        }
      }
    );
    return () => {
      subscription?.remove();
    };
  }, [showToast, t, _emitShowToast])

  return <>
    {showToast &&
            <View style={styles.toastWrapper}>
              <View style={styles.toastContainer}>
                <View style={{ flexShrink: 1 }}>
                  <AppText numberOfLines={numberOfLines} style={[styles.textToastMessage]}>{toastMessage}</AppText>
                </View>
              </View>
            </View>
    }
  </>

})

const useStyles = (theme: ITheme) => StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 44,
    right: 0,
    left: 0,
    zIndex: 999,
    ...globalShadowStyle.shadow,
    alignSelf: 'center',
    alignItems: 'center',
  },

  toastContainer: {
    // width: '100%',
    backgroundColor: theme.color.bg.white,
    paddingHorizontal: theme.dimensions.p8,
    paddingVertical: theme.dimensions.p12,
    borderRadius: theme.dimensions.p8,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: theme.dimensions.deviceWidth - theme.dimensions.p16 * 2,
    justifyContent: 'center',
  },
  textToastMessage: {
    fontSize: theme.fontSize.p13,
  }
})
