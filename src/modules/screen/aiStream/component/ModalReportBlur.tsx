import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import ImageSource from 'src/assets/images';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppText } from 'src/modules/components/text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';
import { ITheme, useAppTheme } from 'src/shared/theme';

interface IButtonIcon {
  onPress: () => void,
  text: string,
  source: string,
}

const BtnIcon = React.memo((props: IButtonIcon) => {
  const theme = useAppTheme();
  const { onPress, text, source } = props;
  return <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ padding: 16, alignItems: 'center' }}>
    <RenderImage
      source={source}
      svgMode={true}
      style={{
        width: 58,
        aspectRatio: 1,
      }}
    />
    <View style={{ height: 10 }} />
    <AppText typo={TxtTypo.Body_M} style={{ color: theme.color.textColor.white }}>{text}</AppText>
  </TouchableOpacity>
})

interface IProps {
}

export const ModalReportBlur = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<Modalize | undefined>) => {
  const theme = useAppTheme();
  const styles = useStyles(theme)

  return <Portal>
    <Modalize
      ref={ref}
      closeOnOverlayTap={true}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'never',
        showsVerticalScrollIndicator: false,
      }}
      withHandle={false}
      modalStyle={{ backgroundColor: 'transparent' }}
      overlayStyle={{ backgroundColor: 'transparent' }}
      adjustToContentHeight={true}
    >
      <>
        <View style={styles.container}>
          <BlurView
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={{ zIndex: 2, flexDirection: 'row' }}>
            <BtnIcon text={'Report'} source={ImageSource.ai_stream_report} onPress={() => null} />
            <BtnIcon text={'Block'} source={ImageSource.ai_stream_block} onPress={() => null} />
          </View>
        </View>
        <View style={{ height: theme.dimensions.getTabBottomHeight}} />
      </>
    </Modalize>
  </Portal>
}))

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    height: theme.dimensions.makeResponsiveSize(180),
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: theme.dimensions.makeResponsiveSize(32),
    paddingHorizontal: theme.dimensions.makeResponsiveSize(32),
  },
})