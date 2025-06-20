import { AppText } from 'components/text/AppText'
import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'

interface IAppButton {
    title?: string
    textStyle?: TextStyle
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    style?: StyleProp<ViewStyle>
    disabled?: boolean
    onPress?: () => void
}

export const AppButton = React.memo((props: IAppButton) => {
  const { title, style, textStyle, disabled, leftIcon, rightIcon, onPress } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return <TouchableOpacity activeOpacity={0.6}
    style={[styles.defaultTouch, style, disabled && { backgroundColor: theme.color.bg.disable }]}
    onPress={onPress}
    disabled={disabled}
  >
    {leftIcon}
    <AppText style={[styles.defaultText, textStyle, disabled && { color: theme.color.textColor.disable }]}>{title}</AppText>
    {rightIcon}
  </TouchableOpacity>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  defaultTouch: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: theme.dimensions.makeResponsiveSize(50),
    paddingVertical: theme.dimensions.p12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultText: {
    marginHorizontal: 4,
    fontFamily: theme.font.Medium,
    fontSize: theme.fontSize.p16,
    color: theme.color.textColor.primary,
    textTransform: 'capitalize'
  },
})
