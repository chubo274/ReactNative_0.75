import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppText } from 'src/modules/components/text/AppText';
import { ITheme, useAppTheme } from 'src/shared/theme';

interface IPropsButtonAction {
  sourceIcon: string,
  text?: string,
  onPress?: () => void
}
export const ButtonAction = (props: IPropsButtonAction) => {
  const { sourceIcon, text, onPress } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.containerWrapper}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}  style={styles.buttonWrapper}>
        <RenderImage svgMode source={sourceIcon} style={styles.styleIcon} />
      </TouchableOpacity>
      {text ?
        <AppText style={{ lineHeight: 19, fontSize: theme.dimensions.p16, fontWeight: '700', color: '#FFFF', paddingTop: theme.dimensions.p6 }}>
          {text}
        </AppText>
        : null}
    </View>
  )
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.dimensions.makeResponsiveSize(22)
  },
  buttonWrapper: {
    width: theme.dimensions.makeResponsiveSize(45),
    height: theme.dimensions.makeResponsiveSize(45),
    borderRadius: 100,
    backgroundColor: theme.color.blackBlurColor02,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  styleIcon: {
    width: theme.dimensions.p24,
    height: theme.dimensions.p24
  }
})