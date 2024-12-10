import { AppText } from 'components/text/AppText';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EmitType } from 'shared/helpers/constant';
import { ITheme, useAppTheme } from 'shared/theme';
import ImageSource from 'src/assets/images';
import { TxtTypo } from 'src/shared/helpers/enum';
import { RenderImage } from '../image/RenderImage';
import { X } from './Icons/X';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export interface IAppToast {
  type?: 'Error' | 'Warning' | 'Success' | 'Saved'
  toastMessage?: string
  numberOfLines?: number
  onPress?: () => void
}

export const AppToast = React.memo((props: IAppToast) => {
  const { t } = useTranslation()
  const theme = useAppTheme();
  const inset = useSafeAreaInsets()
  const styles = useStyles(theme, inset);
  const [showToast, setShowToast] = useState(false)
  const [toastConfig, setToastConfig] = useState<IAppToast>({})
  const { type = 'Success', toastMessage = '', numberOfLines = 1, onPress } = useMemo(() => toastConfig, [toastConfig])
  const isToast = useRef(false)

  const _emitShowToast = useCallback((params: IAppToast) => {
    if (!isToast.current) {
      isToast.current = true
      setToastConfig(params)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        isToast.current = false
      }, 2000)
    }
  }, [])

  const _color = useMemo(() => {
    switch (type) {
      case 'Error':
        return theme.color.red[700]
      case 'Saved':
        return '#5E8AD2'
      case 'Warning':
        return theme.color.tertiary[700]
      case 'Success':
      default:
        return theme.color.primary[900]
    }
  }, [type, theme])

  const pressInToast = useCallback(() => {
    setShowToast(false)
    onPress?.()
  }, [onPress])

  // render
  const renderIconLeft = useCallback(() => {
    let source = ''
    switch (type) {
      case 'Error':
        source = ImageSource.mage_box_3d_cross_fill
        break;
      case 'Saved':
        source = ImageSource.lets_icons_order_light
        break;
      case 'Warning':
        source = ImageSource.si_warning_fill
        break;
      case 'Success':
      default:
        source = ImageSource.icon_park_solid_check_one
        break;
    }
    return <View style={{ marginRight: 8 }}>
      <RenderImage svgMode source={source} style={{ width: 24, aspectRatio: 1 }} />
    </View>
  }, [type])

  const renderIconRight = useCallback(() => {
    if (!onPress) return null
    return <TouchableOpacity activeOpacity={0.8}
      onPress={() => setShowToast(false)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <X size={24} stroke={_color} />
    </TouchableOpacity>
  }, [_color, onPress])

  // effect
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      EmitType.AppToast,
      (params: IAppToast) => { _emitShowToast(params) }
    );
    return () => {
      subscription?.remove();
    };
  }, [showToast, t, _emitShowToast])

  return <>
    {showToast &&
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.9} style={styles.toastContainer} onPress={pressInToast}>
          {renderIconLeft()}
          <View style={{ flexShrink: 1, marginRight: 8 }}>
            <AppText numberOfLines={numberOfLines} typo={TxtTypo.Smallest_M} style={[styles.textToastMessage, { color: _color }]}>{toastMessage}</AppText>
          </View>
          {renderIconRight()}
        </TouchableOpacity>
      </View>
    }
  </>

})

const useStyles = (theme: ITheme, inset: EdgeInsets) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: inset.top + 16,
    zIndex: 999,
    alignSelf: 'center',
  },
  toastContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: theme.color.stroke,
    borderWidth: 1,
    backgroundColor: theme.color.white,
    paddingHorizontal: theme.dimensions.p8,
    paddingVertical: theme.dimensions.p8,
    maxWidth: theme.dimensions.deviceWidth - theme.dimensions.p16 * 2,
    justifyContent: 'center',
  },
  textToastMessage: {
  }
})
