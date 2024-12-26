import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePicker, { Image, ImageOrVideo, Video } from 'react-native-image-crop-picker';
import { AppBottomSheet } from 'src/modules/components/modal/AppBottomSheet';
import { AppText } from 'src/modules/components/text/AppText';
import { useRequestPermission } from 'src/shared/hooks/usePermission';
import { ITheme, useAppTheme } from 'src/shared/theme';


type IProps = IPropsPhotoMultiple | IPropsVideoMultiple | IPropsPhoto | IPropsVideo | IPropsImageVideo | IPropsImageVideoMultiple

export const ModalChooseMedia = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { onSelected, mediaType, multiple } = props;
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation()
  const requestLibrary = useRequestPermission('Library')
  const requestCamera = useRequestPermission('Camera')

  const closeModal = useCallback(() => {
    setTimeout(() => {
      // @ts-ignore
      ref.current?.close()
    }, 10);
  }, [ref])

  const onOpenLibrary = useCallback(async () => {
    const status = await requestLibrary();
    if (!status) return null
    closeModal()
    ImagePicker.openPicker({ mediaType: mediaType, multiple, quality: 1, })
      .then((value) => {
        // @ts-ignore
        onSelected(value)
      }).catch((reason: any) => {
        if (reason?.message?.includes('User cancelled')) {
          console.info('User cancelled: ', reason);
          return
        }
        console.error('error: ', reason);
      })
  }, [onSelected, mediaType, closeModal, requestLibrary, multiple]);

  const onOpenCamera = useCallback(async () => {
    const status = await requestCamera();
    if (!status) return null
    closeModal()
    ImagePicker.openCamera({ mediaType: mediaType, multiple, quality: 1, })
      .then((value) => {
        // @ts-ignore
        onSelected(value)
      }).catch((reason: any) => {
        if (reason?.message?.includes('User cancelled')) {
          console.info('User cancelled: ', reason);
          return
        }
        console.error('error: ', reason);
      })
  }, [requestCamera, onSelected, mediaType, closeModal, multiple]);

  return <AppBottomSheet
    ref={ref}
    snapPoints={['20%']}
    backgroundStyle={{ backgroundColor: 'white' }}
  >
    <View>
      <TouchableOpacity onPress={onOpenLibrary} style={styles.styleBtn} activeOpacity={0.8}>
        <AppText>
          {t('selectVideoFormLib')}
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onOpenCamera} style={styles.styleBtn} activeOpacity={0.8}>
        <AppText>
          {t('takeVideoLive')}
        </AppText>
      </TouchableOpacity>
    </View>
  </AppBottomSheet>
}));

const useStyles = (theme: ITheme) => StyleSheet.create({
  styleBtn: {
    marginTop: theme.dimensions.p24,
    paddingHorizontal: theme.dimensions.p12
  }
})

// interface props
interface IPropsBase {
  mediaType?: 'photo' | 'video';
  multiple?: boolean;
}

interface IPropsPhotoMultiple extends IPropsBase {
  mediaType: 'photo';
  multiple: true;
  onSelected: (result: Image[]) => void;
}

interface IPropsVideoMultiple {
  mediaType: 'video';
  multiple: true;
  onSelected: (result: Video[]) => void;
}

interface IPropsImageVideo {
  mediaType: undefined;
  multiple: true;
  onSelected: (result: ImageOrVideo[]) => void;
}

interface IPropsPhoto {
  mediaType: 'photo';
  multiple?: false;
  onSelected: (result: Image) => void;
}

interface IPropsVideo {
  mediaType: 'video';
  multiple?: false;
  onSelected: (result: Video) => void;
}

interface IPropsImageVideoMultiple {
  mediaType: undefined;
  multiple?: false;
  onSelected: (result: ImageOrVideo) => void;
}
