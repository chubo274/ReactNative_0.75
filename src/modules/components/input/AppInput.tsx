import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import ImageSource from 'src/assets/images';
import { TxtTypo } from 'src/shared/helpers/enum';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';
import { AppText } from '../text/AppText';

export interface IAppInput extends TextInputProps {
  value?: string;
  errorMessage?: string;
  pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto' | undefined;
  inputContainerStyle?: StyleProp<ViewStyle>;
  iconLeft?: () => React.JSX.Element;
  iconRight?: () => React.JSX.Element;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean
  textLabel?: string
  onClear?: () => void
  status?: 'success' | 'error'
}

const dimensionTransY = -12
export const AppInput = React.memo((props: IAppInput) => {
  const { value, inputContainerStyle, pointerEvents, iconLeft, iconRight, errorMessage, inputStyle, disabled, placeholder, status, onClear, textLabel, ...rest } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const ref = useRef<TextInput>(null)

  // style border by status
  const renderBorderStyle = useMemo(() => {
    const styleBorderStatus = { error: 'red', success: 'green' };
    const defaultBorder: ViewStyle = { borderRadius: 8, borderWidth: 1 }

    if (disabled) return [defaultBorder, { borderColor: theme.color.stroke }]
    if (status) return [defaultBorder, { borderColor: styleBorderStatus[status] }]
    return [defaultBorder, { borderColor: theme.color.stroke }]
  }, [status, theme, disabled])

  // style disabled
  const renderDisableStyle = useMemo((): Record<string, ViewStyle | TextStyle> | undefined => {
    if (disabled)
      return {
        txt: {
          color: theme.color.neutral[200]
        },
        bg: {
          backgroundColor: theme.color.neutral[100]
        }
      }
  }, [disabled, theme.color])

  // animated
  const transY = useSharedValue<number>(value ? dimensionTransY : 0);
  const stylezLabel = useAnimatedStyle((): ViewStyle => ({ transform: [{ translateY: transY.value }] }))
  const stylezTxtLabel = useAnimatedStyle((): TextStyle => ({
    color: interpolateColor(transY.value, [0, dimensionTransY], [theme.color.textColor.primary, theme.color.textColor.subText])
  }))
  const pressFocus = useCallback(() => {
    ref.current?.focus()
    transY.value = withTiming(dimensionTransY)
  }, [transY])

  // render
  const renderIconLeft = useCallback(() => {
    if (iconLeft)
      return <View style={{ marginRight: 4 }}>{iconLeft()}</View>
  }, [iconLeft])

  const renderIconClear = useCallback(() => {
    if (!value) return null
    return <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 4 }} onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}>
      <RenderImage source={ImageSource.ic_apple} style={{ width: 16, aspectRatio: 1 }} />
    </TouchableOpacity>
  }, [value, onClear])

  const renderIconRight = useCallback(() => {
    if (iconRight)
      return <View style={{ marginLeft: 4 }}>{iconRight()}</View>
  }, [iconRight])

  const renderErrorMessage = useCallback(() => {
    if (errorMessage)
      return <AppText typo={TxtTypo.Smallest_R} style={{ paddingTop: 4, color: 'red' }}>
        {errorMessage}
      </AppText>
  }, [errorMessage])

  // useEffect
  useEffect(() => {
    if (!value && !ref.current?.isFocused()) {
      transY.value = withTiming(0)
    }
  }, [value, transY])

  return <>
    <TouchableWithoutFeedback onPress={pressFocus}>
      <View style={[styles.inputContainer, inputContainerStyle, renderBorderStyle, renderDisableStyle?.bg]} pointerEvents={pointerEvents}>
        <Animated.View style={[styles.viewLabelDefault, stylezLabel]}>
          <Animated.Text style={[styles.txtLabelDefault, stylezTxtLabel, renderDisableStyle?.txt]}>{textLabel}</Animated.Text>
        </Animated.View>
        <View style={styles.inputWrapper}>
          {renderIconLeft()}
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {/* height for label animated end */}
            <View style={{ height: 21 }} />
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                ref={ref}
                numberOfLines={1}
                placeholder={placeholder}
                placeholderTextColor={theme.color.textColor.subText}
                {...rest}
                editable={!disabled}
                autoCapitalize="none"
                value={value?.toString()}
                onFocus={(e) => {
                  transY.value = withTiming(dimensionTransY)
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  if (!value) transY.value = withTiming(0)
                  props.onBlur?.(e);
                }}
                style={[styles.inputStyleDefault, inputStyle, renderDisableStyle?.txt]}
              />
            </View>
          </View>
          {renderIconClear()}
          {renderIconRight()}
        </View>
      </View>
    </TouchableWithoutFeedback>
    {renderErrorMessage()}
  </>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: theme.dimensions.p16,
    paddingVertical: theme.dimensions.p12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyleDefault: {
    flex: 1,
    fontSize: theme.fontSize.p14,
    lineHeight: theme.dimensions.makeResponsiveSize(20),
    color: theme.color.textColor.primary,
  },
  viewLabelDefault: {
    position: 'absolute',
    left: theme.dimensions.p16,
  },
  txtLabelDefault: {
    fontSize: theme.fontSize.p14,
    color: theme.color.textColor.primary,
    fontFamily: theme.font.HelveticaNeue,
    fontWeight: 400,
  }
});

