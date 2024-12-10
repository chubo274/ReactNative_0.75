import { AppText } from 'components/text/AppText';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatableValue, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { EmitType } from 'shared/helpers/constant';
import { ITheme, useAppTheme } from 'shared/theme';
import ImageSource from 'src/assets/images';
import { TxtTypo } from 'src/shared/helpers/enum';
import { RenderImage } from '../image/RenderImage';
import { X } from './Icons/X';

export interface IAppToast {
  type?: 'Error' | 'Warning' | 'Success' | 'Saved'
  toastMessage?: string
  numberOfLines?: number
  onPress?: () => void
}

export const AppToast = React.memo((props: IAppToast) => {
  const { t } = useTranslation()
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const [showToast, setShowToast] = useState(true)
  const [toastConfig, setToastConfig] = useState<IAppToast>({})
  const { type = 'Success', toastMessage = '', numberOfLines = 1, onPress } = useMemo(() => toastConfig, [toastConfig])
  const toastTimer = useRef<NodeJS.Timeout>()
  const transY = useSharedValue(0);

  const _toastOut = useCallback(() => {
    const changeJs = () => {
      setShowToast(false)
      clearTimeout(toastTimer.current)
      toastTimer.current = undefined
    }
    transY.value = withSequence(
      withTiming(90, { duration: 300 }),
      withTiming(-90, { duration: 700 }, (finished?: boolean, current?: AnimatableValue) => {
        if (finished) {
          runOnJS(changeJs)()
        }
      }),
    )
  }, [transY])

  const _emitShowToast = useCallback((params: IAppToast) => {
    if (!toastTimer.current) {
      setToastConfig(params)
      setShowToast(true)
      transY.value = withTiming(74, { duration: 700 });
      toastTimer.current = setTimeout(() => {
        _toastOut()
      }, 2000);
    }
  }, [_toastOut, transY])

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
    clearTimeout(toastTimer.current)
    _toastOut()
    onPress?.()
  }, [onPress, _toastOut])

  // animation
  const stylezContainer = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transY.value }],
    }
  }, [transY]);

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
      <Animated.View style={[styles.container, stylezContainer]}>
        <TouchableOpacity activeOpacity={0.9} style={styles.toastContainer} onPress={pressInToast}>
          {renderIconLeft()}
          <View style={{ flexShrink: 1, marginRight: 8 }}>
            <AppText numberOfLines={numberOfLines} typo={TxtTypo.Smallest_M} style={[styles.textToastMessage, { color: _color }]}>{toastMessage}</AppText>
          </View>
          {renderIconRight()}
        </TouchableOpacity>
      </Animated.View>
    }
  </>

})

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: -30,
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
