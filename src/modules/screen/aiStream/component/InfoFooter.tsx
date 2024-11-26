import React, { useCallback, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextLayoutEventData, TouchableOpacity, View } from 'react-native';
import ImageSource from 'src/assets/images';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppText } from 'src/modules/components/text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';
import { ITheme, useAppTheme } from 'src/shared/theme';

export const InfoFooter = () => {
  const theme = useAppTheme();
  const [showMore, setShowMore] = useState(false)
  const sizeImage = theme.dimensions.p30
  const [widthText, setWidthText] = useState(0)
  const [numberLengthOfText, setNumberLengthOfText] = useState(0)
  const styles = useStyles(theme, showMore, numberLengthOfText);
  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { width } = e.nativeEvent.lines[0];
    const length = e.nativeEvent.lines.length
    setWidthText(width)
    setNumberLengthOfText(length)
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.viewProduct} >
        <RenderImage
          source={ImageSource.imageAiStream}
          style={{ width: sizeImage, height: sizeImage, borderRadius: sizeImage }}
          resizeMode={'cover'}
          fallBackSource={ImageSource.img_fallback}
        />
        <AppText typo={TxtTypo.Bodysmall_R} style={styles.txtTitleProduct}>
          Bionic tech Essential Oil Diffuser
        </AppText>
      </View>

      <View>
        <View style={styles.titleWrapper}>
          <AppText style={styles.txtTitleStream}>Tere mere sath</AppText>
          <RenderImage
            source={ImageSource.imageAiStream}
            style={{ width: 14, height: 14, marginLeft: theme.dimensions.p4 }}
            resizeMode={'cover'}
            fallBackSource={ImageSource.img_fallback}
          />
        </View>
        <View style={styles.subTitleWrapper}>
          <AppText style={styles.txtSubTitle} onTextLayout={handleTextLayout} numberOfLines={showMore ? undefined : 1}>Buy our new  Buy our new Buy our new Buy our new Buy our new  Buy our new Buy our new  Buy our new</AppText>
          {widthText > 220
            ?
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowMore((prev) => !prev)} style={{ justifyContent: "flex-end" }}>
              <AppText style={styles.txtMore}>{showMore ? `${`Hide`}` : `${`More`}`}</AppText>
            </TouchableOpacity>
            : null}
        </View>
      </View>
    </View>
  )
}

const useStyles = (theme: ITheme, showMore: boolean, numberLengthOfText: number) => StyleSheet.create({
  containerWrapper: {
    top: !showMore ? 100 : 100 - numberLengthOfText * 10
  },
  viewProduct: {
    backgroundColor: 'background: rgba(12, 32, 54, 0.6)',
    flexDirection: 'row',
    paddingVertical: theme.dimensions.p6,
    paddingHorizontal: theme.dimensions.p16,
    borderRadius: 6,
    alignItems: 'center',
    maxWidth: theme.dimensions.makeResponsiveSize(271)
  },
  txtTitleProduct: {
    color: theme.color.white,
    paddingLeft: theme.dimensions.p6
  },
  titleWrapper: {
    flexDirection: 'row',
    paddingTop: theme.dimensions.p20,
    paddingBottom: theme.dimensions.p8
  },
  txtTitleStream: {
    fontWeight: '500',
    lineHeight: 14,
    fontSize: theme.fontSize.p12,
    color: theme.color.white
  },
  subTitleWrapper: {
    flexDirection: 'row',
    maxWidth: 240,
  },
  txtSubTitle: {
    fontWeight: '400',
    lineHeight: 14,
    fontSize: theme.fontSize.p12,
    color: theme.color.white
  },
  txtMore: {
    fontWeight: '400',
    lineHeight: 14,
    fontSize: theme.fontSize.p12,
    color: theme.color.darkMprimary,
    paddingLeft: theme.dimensions.p2
  }
})