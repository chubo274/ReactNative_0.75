import React, { ReactNode, useMemo } from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'
import { TxtTypo } from 'src/shared/helpers/enum';

interface IAppText extends TextProps {
    children: string | ReactNode,
    typo?: TxtTypo,
}

export const AppText = React.memo((props: IAppText) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { children, typo, ...rest } = props;
  const typoStyle: StyleProp<TextStyle> = useMemo(() => {
    switch (typo) {
      case TxtTypo.Smallest_R:
        return {
          fontSize: theme.fontSize.p12,
          lineHeight: theme.dimensions.makeResponsiveSize(18),
        }
      case TxtTypo.Smallest_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p12,
          lineHeight: theme.dimensions.makeResponsiveSize(18),
        }
      case TxtTypo.Bodysmall_R:
        return {
          fontSize: theme.fontSize.p14,
          lineHeight: theme.dimensions.makeResponsiveSize(21),
        }
      case TxtTypo.Bodysmall_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p14,
          lineHeight: theme.dimensions.makeResponsiveSize(21),
        }
      case TxtTypo.Body_R:
        return {
          fontSize: theme.fontSize.p16,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Body_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p16,
          lineHeight: theme.dimensions.makeResponsiveSize(18),
        }
      case TxtTypo.Heading5_R:
        return {
          fontSize: theme.fontSize.p20,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Heading5_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p20,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Heading4_R:
        return {
          fontSize: theme.fontSize.p24,
          lineHeight: theme.dimensions.makeResponsiveSize(28),
        }
      case TxtTypo.Heading4_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p24,
          lineHeight: theme.dimensions.makeResponsiveSize(28),
        }
      case TxtTypo.Heading3_R:
        return {
          fontSize: theme.fontSize.p32,
          lineHeight: theme.dimensions.makeResponsiveSize(38),
        }
      case TxtTypo.Heading3_B:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p32,
          lineHeight: theme.dimensions.makeResponsiveSize(38),
        }
      case TxtTypo.Heading2:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p42,
          lineHeight: theme.dimensions.makeResponsiveSize(50),
        }
      case TxtTypo.Heading1:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p52,
          lineHeight: theme.dimensions.makeResponsiveSize(62),
        }
      case TxtTypo.Display2:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p72,
          lineHeight: theme.dimensions.makeResponsiveSize(86),
        }
      case TxtTypo.Display1:
        return {
          fontWeight: 700,
          fontSize: theme.fontSize.p120,
          lineHeight: theme.dimensions.makeResponsiveSize(144),
        }

      default:
        return null
    }
  }, [typo, theme])

  return <Text  allowFontScaling={false} {...rest} style={[styles.defaultStyle, typoStyle, props.style]}>{children}</Text>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  defaultStyle: {
    fontFamily: theme.font.Regular,
    fontSize: theme.fontSize.p14,
    color: theme.color.textColor.primary,
    fontWeight: 400,
  }
})
