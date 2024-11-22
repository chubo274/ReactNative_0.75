import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppText } from 'src/modules/components/text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';
import { ITheme, useAppTheme } from 'src/shared/theme';

interface IButtonIcon {
  onPress: () => void
}

const BtnIcon = React.memo((props: IButtonIcon) => {
  const { onPress } = props;
  return <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginRight: 16 }}>
    <RenderImage
      source={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuhXF-l1ynwcCE6SyW01jY2VjgbRkKtS8H-w&s'}
      style={{
        width: 45,
        aspectRatio: 1,
      }}
    />
  </TouchableOpacity>
})

interface IProps {
}

export const ModalShareBlur = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<Modalize | undefined>) => {
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
          <View style={{ zIndex: 2 }}>
            <AppText typo={TxtTypo.Heading5_M} style={{ color: theme.color.textColor.white }}>Share with friend</AppText>
            <View style={{ flexDirection: 'row', marginTop: theme.dimensions.p24 }}>
              <BtnIcon onPress={() => null} />
              <BtnIcon onPress={() => null} />
              <BtnIcon onPress={() => null} />
              <BtnIcon onPress={() => null} />
              <BtnIcon onPress={() => null} />
              <BtnIcon onPress={() => null} />
            </View>
          </View>
        </View>
        <View style={{ height: theme.dimensions.getTabBottomHeight }} />
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
    paddingHorizontal: theme.dimensions.makeResponsiveSize(16),
  },
})