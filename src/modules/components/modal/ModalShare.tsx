import BottomSheet from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from '@react-native-community/blur';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Share, { ShareSingleOptions, Social } from 'react-native-share';
import ImageSource from 'src/assets/images';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppBottomSheet } from 'src/modules/components/modal/AppBottomSheet';
import { AppText } from 'src/modules/components/text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';
import { emitShowToast } from 'src/shared/helpers/function';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { AppButton } from '../button/AppButton';


interface IProps {
  message: string,
  url: string,
  onSuccess?: () => void,
  onFail?: () => void,
}

const contentHeight = 180

export const ModalShare = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { message, url, onFail, onSuccess } = props
  const theme = useAppTheme();
  const styles = useStyles(theme)
  const { t } = useTranslation()

  const onCopy = useCallback(() => {
    Clipboard.setString(`${message} ${url}`);
    emitShowToast({ type: 'Success', toastMessage: t('copySuccess') });
    setTimeout(() => {
      // @ts-ignore
      ref?.current?.close()
    }, 10);
  }, [message, ref, t, url])

  const shareTo = async (app: Exclude<Social, Social.FacebookStories | Social.InstagramStories>) => {
    try {
      switch (app) {
        case Social.Email:
        case Social.Sms:
          await Share.open({
            subject: message, // Tiêu đề email
            message: `${message} ${url}`,
          });
          setTimeout(() => {
            onSuccess?.()
          }, 300);
          return;
        default:
          const options: ShareSingleOptions = {
            message,
            url,
            social: app,
          };
          const result = await Share.shareSingle(options);
          if (result.success) {
            emitShowToast({ type: 'Success', toastMessage: t('streamSharedSuccessfully') });
            onSuccess?.()
          }
          break;
      }
    } catch (error: any) {
      if (error.message === 'User did not share') {
        console.info(`❌ User canceled sharing to ${app}`);
      } else {
        console.error(`❌ Failed to share to ${app}:`, error);
        emitShowToast({ type: 'Error', toastMessage: t('somethingWrong') });
        onFail?.()
      }
    } finally {
      setTimeout(() => {
        // @ts-ignore
        ref?.current?.close()
      }, 10);
    }
  };

  const handleComponent = useCallback(() => {
    return <View style={styles.handleStyle}>
      <View style={styles.handleView} />
    </View>
  }, [styles])

  const viewCopy = useCallback(() => {
    return <TouchableOpacity activeOpacity={0.8} style={styles.viewCopy} onPress={onCopy}>
      <View style={{ flexShrink: 1, paddingHorizontal: 12 }}>
        <AppText typo={TxtTypo.Bodysmall_M} style={{ color: theme.color.textColor.white }} numberOfLines={1}>{url}</AppText>
      </View>
      <AppButton title={t('copyLink')} onPress={onCopy} />
    </TouchableOpacity>
  }, [t, url, onCopy, styles.viewCopy, theme.color])

  return <AppBottomSheet
    ref={ref}
    snapPoints={[contentHeight + theme.dimensions.getTabBottomHeight]}
    backgroundStyle={{ backgroundColor: 'transparent' }}
    enableOverDrag={false}
    handleComponent={null}
    backdropOpacity={0}
  >
    <View style={{ flex: 1, overflow: 'hidden', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: theme.dimensions.p24 }}>
      <BlurView
        style={{
          zIndex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={{ zIndex: 2 }}>
        {handleComponent()}
        <View style={styles.viewTitle}>
          <AppText typo={TxtTypo.Heading5_M} style={{ color: theme.color.textColor.white }}>{t('shareWithFriend')}</AppText>
          <AppText typo={TxtTypo.Smallest_R} style={{ color: theme.color.textColor.white }}>{t('shareWithFriendSubText')}</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.dimensions.p24 }}>
          <BtnIcon type={'fb'} onPress={() => shareTo(Social.Facebook)} />
          <BtnIcon type={'whatsapp'} onPress={() => shareTo(Social.Whatsapp)} />
          <BtnIcon type={'linkedin'} onPress={() => shareTo(Social.Linkedin)} />
          <BtnIcon type={'mail'} onPress={() => shareTo(Social.Email)} />
          <BtnIcon type={'twitter'} onPress={() => shareTo(Social.Twitter)} />
          <BtnIcon type={'telegram'} onPress={() => shareTo(Social.Telegram)} />
        </View>
        <View>
          {viewCopy()}
        </View>
      </View>
    </View>
  </AppBottomSheet>
}))

// internal component dont need export
interface IButtonIcon {
  onPress: () => void
  type: 'fb' | 'whatsapp' | 'linkedin' | 'mail' | 'twitter' | 'telegram'
}

const BtnIcon = React.memo((props: IButtonIcon) => {
  const { onPress, type } = props;
  let source = ''
  switch (type) {
    case 'twitter':
      source = ImageSource.Twitter_svg
      break;
    case 'whatsapp':
      source = ImageSource.whatsapp_svg
      break;
    case 'linkedin':
      source = ImageSource.linkedin_symbol
      break;
    case 'fb':
      source = ImageSource.fb_svg
      break;
    case 'telegram':
      source = ImageSource.telegram_svg
      break;
    case 'mail':
      source = ImageSource.mail_svg
      break;
    default:
      break;
  }
  return <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginRight: 16 }}>
    <RenderImage
      svgMode
      source={source}
      style={{
        width: 42,
        aspectRatio: 1,
      }}
    />
  </TouchableOpacity>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  handleStyle: {
    alignItems: 'center',
  },
  handleView: {
    zIndex: 2,
    width: 60,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 8,
    marginTop: theme.dimensions.p8,
  },
  viewTitle: {
    marginTop: theme.dimensions.p24,
  },
  viewCopy: {
    flexDirection: 'row',
    marginTop: theme.dimensions.p24,
    backgroundColor: '#4A5567',
    borderRadius: 8,
    alignItems: 'center',
  },
})
