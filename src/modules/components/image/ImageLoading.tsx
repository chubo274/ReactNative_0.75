import ImageSource from 'src/assets/images';
import { AppText } from 'components/text/AppText';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { EmitType } from 'shared/helpers/constant';
import { ITheme, useAppTheme } from 'shared/theme';
import { RenderImage } from './RenderImage';

interface IProps {
}

export const ImageLoading = React.memo((props: IProps) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      EmitType.AppLoading, (isShow: boolean) => {
        setIsLoading(isShow)
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!isLoading) {return null}

  return <View style={styles.container}>
    <RenderImage source={ImageSource.gif_loading_spinner} style={styles.imgGif} />
    <View style={{ height: 8 }} />
    <AppText style={styles.textLoading}>{t('loading')}</AppText>
  </View>
});

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
  },
  imgGif: {
    width: theme.dimensions.makeResponsiveSize(40),
    height: theme.dimensions.makeResponsiveSize(40),
  },
  textLoading: {
    color: theme.color.textColor.white,
  }
})
