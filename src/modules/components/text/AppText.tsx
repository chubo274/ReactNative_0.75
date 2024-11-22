import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'
import { TxtTypo } from 'src/shared/helpers/enum';

interface IAppText extends TextProps {
  children: string | ReactNode,
  typo?: TxtTypo,
}

export const AppText = React.memo((props: IAppText) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { children, typo, ...rest } = props
  const typoStyle = useMemo(() => {
    switch (typo) {
      case TxtTypo.Smallest_R:
        return {
          fontFamily: theme.font.Regular,
          fontSize: theme.fontSize.p12,
          lineHeight: theme.dimensions.makeResponsiveSize(18),
        }
      case TxtTypo.Smallest_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p12,
          lineHeight: theme.dimensions.makeResponsiveSize(18),
        }
      case TxtTypo.Bodysmall_R:
        return {
          fontFamily: theme.font.Regular,
          fontSize: theme.fontSize.p14,
          lineHeight: theme.dimensions.makeResponsiveSize(21),
        }
      case TxtTypo.Bodysmall_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p14,
          lineHeight: theme.dimensions.makeResponsiveSize(21),
        }
      case TxtTypo.Body_R:
        return {
          fontFamily: theme.font.Regular,
          fontSize: theme.fontSize.p16,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Body_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p16,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Heading5_R:
        return {
          fontFamily: theme.font.Regular,
          fontSize: theme.fontSize.p20,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Heading5_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p20,
          lineHeight: theme.dimensions.makeResponsiveSize(24),
        }
      case TxtTypo.Heading4_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p24,
          lineHeight: theme.dimensions.makeResponsiveSize(28),
        }
      case TxtTypo.Heading4_B:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p24,
          lineHeight: theme.dimensions.makeResponsiveSize(28),
        }
      case TxtTypo.Heading3_M:
        return {
          fontFamily: theme.font.Medium,
          fontSize: theme.fontSize.p32,
          lineHeight: theme.dimensions.makeResponsiveSize(38),
        }
      case TxtTypo.Heading3_B:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p32,
          lineHeight: theme.dimensions.makeResponsiveSize(38),
        }
      case TxtTypo.Heading2:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p42,
          lineHeight: theme.dimensions.makeResponsiveSize(50),
        }
      case TxtTypo.Heading1:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p52,
          lineHeight: theme.dimensions.makeResponsiveSize(62),
        }
      case TxtTypo.Display2:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p72,
          lineHeight: theme.dimensions.makeResponsiveSize(86),
        }
      case TxtTypo.Display1:
        return {
          fontFamily: theme.font.Bold,
          fontSize: theme.fontSize.p120,
          lineHeight: theme.dimensions.makeResponsiveSize(144),
        }

      default:
        return {
          fontFamily: theme.font.Regular,
          fontSize: theme.fontSize.p20,
          lineHeight: theme.dimensions.makeResponsiveSize(21),
        }
    }
  }, [typo, theme])

  return <Text {...rest} style={[styles.defaultStyle, typoStyle, props.style]}>{children}</Text>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  defaultStyle: {
    color: theme.color.textColor.primary,
  }
})
