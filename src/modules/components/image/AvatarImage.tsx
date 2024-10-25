import ImageSource from 'src/assets/images';
import { AppText } from 'components/text/AppText';
import React from 'react';
import { ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ResizeMode } from 'react-native-fast-image';
import { ITheme, useAppTheme } from 'shared/theme';
import { RenderImage } from './RenderImage';

interface IAvatarImage {
    size: number,
    onPress?: () => void,
    source?: ImageSourcePropType | string,
    number?: number
    resizeMode?: ResizeMode
}

export const AvatarImage = (props: IAvatarImage) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { size, onPress, source, number, resizeMode } = props;

  return (
    <View>
      <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.8} style={styles.borderAvatar}>
        <RenderImage
          source={source}
          style={{ width: theme.dimensions.makeResponsiveSize(size), height: theme.dimensions.makeResponsiveSize(size), borderRadius: theme.dimensions.makeResponsiveSize(size) }}
          resizeMode={resizeMode ? resizeMode : 'cover'}
          fallBackSource={ImageSource.img_fallback}
        />
        {number ? <View style={styles.viewBgNumber}>
          <View style={styles.viewNumber}>
            <AppText style={styles.textNumber}>{number}</AppText>
          </View>
        </View> : null}
      </TouchableOpacity>
    </View>
  )
}
const useStyles = (theme: ITheme) => StyleSheet.create({
  borderAvatar: {
    borderWidth: 1,
    borderRadius: 1000,
  },
  viewBgNumber: {
    backgroundColor: theme.color.bg.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: theme.dimensions.makeResponsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3.12,
    paddingVertical: 3.12,
  },
  viewNumber: {
    height: theme.dimensions.makeResponsiveSize(12),
    width: theme.dimensions.makeResponsiveSize(12),
    backgroundColor: theme.color.bg.white,
    borderRadius: theme.dimensions.makeResponsiveSize(14),
    alignItems: 'center',
    justifyContent: 'center'
  },
  textNumber: {
    color: theme.color.textColor.white,
    fontSize: theme.fontSize.makeResponsiveSize(9),
    fontFamily: theme.font.Medium,
    textAlign: 'center'
  }
});
