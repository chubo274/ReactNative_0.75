import React, { ReactNode } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'

interface IAppText extends TextProps {
    children: string | ReactNode
}

export const AppText = React.memo((props: IAppText) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { children } = props

  return <Text {...props} style={[styles.defaultStyle, props.style]}>{children}</Text>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  defaultStyle: {
    fontFamily: theme.font.Regular,
    fontSize: theme.fontSize.p15,
    color: theme.color.textColor.primary,
  }
})
