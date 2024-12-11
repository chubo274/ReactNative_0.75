import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Video, { ReactVideoProps, VideoRef } from 'react-native-video';
import ImageSource from 'src/assets/images';
import { emitShowToast } from 'src/shared/helpers/function';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';

interface IProps extends IPropsRenderVideo {
  containerStyle?: StyleProp<ViewStyle>
  thumbnail?: string
  isPendingShow?: boolean
  layerContent?: React.JSX.Element
}

// controls rendervideo
export const AppVideo = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<VideoRef | null>) => {
  const theme = useAppTheme();
  const { containerStyle, thumbnail, onReadyForDisplay, isPendingShow, paused, layerContent, ...rest } = props;
  const styles = useStyles(theme);
  const { t } = useTranslation()

  // @ts-ignore
  // const refCurrent: VideoRef = ref?.current
  const [isPaused, setIsPaused] = useState<boolean>(Boolean(paused)) // for init state
  const [displayReady, setDisplayReady] = useState<boolean>(false)

  const togglePlay = useCallback(() => {
    setIsPaused(!isPaused)
  }, [isPaused])

  const _onReadyForDisplay = useCallback(() => {
    setDisplayReady(true);
    onReadyForDisplay?.()
  }, [onReadyForDisplay])

  useEffect(() => {
    setIsPaused((prev: boolean) => {
      if (prev != paused) return Boolean(paused);
      return prev
    })
  }, [paused])

  const renderThumbnail = useCallback(() => {
    if ((isPendingShow || !displayReady)) {
      return <View style={styles.viewOtherLayer}>
        <RenderImage
          source={thumbnail}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode={'cover'}
        />
      </View>
    }
    return null;
  }, [styles, isPendingShow, displayReady, thumbnail])

  const renderVideo = useCallback(() => {
    if (!isPendingShow) {
      return <RenderVideo
        ref={ref}
        paused={isPaused}
        onReadyForDisplay={_onReadyForDisplay}
        onError={(e) => {
          console.info('video error: ', rest?.source, e);
          emitShowToast({ type: 'Error', toastMessage: t('loadingStreamError') })
        }}
        {...rest}
      />
    }
    return null;
  }, [t, ref, rest, isPendingShow, isPaused, _onReadyForDisplay])

  const renderControllerVideo = useCallback(() => {
    if (!isPendingShow && displayReady && isPaused) {
      return <View style={styles.viewOtherLayer}>
        <RenderImage
          source={ImageSource.ic_play}
          style={styles.viewPlay}
          svgMode
        />
      </View>
    }
    return null;
  }, [isPendingShow, displayReady, isPaused, styles])

  return <TouchableOpacity activeOpacity={1} style={[styles.containerView, containerStyle]} onPress={togglePlay}>
    {renderThumbnail()}
    {renderVideo()}
    {renderControllerVideo()}
    {layerContent}
  </TouchableOpacity>
}))

// sub common, dont need export
interface IPropsRenderVideo extends Omit<ReactVideoProps, 'source' | 'controls'> {
  source?: string
}
const RenderVideo = React.memo(React.forwardRef((props: IPropsRenderVideo, ref: React.ForwardedRef<VideoRef | null>) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return <Video
    ref={ref}
    resizeMode={'cover'}
    playWhenInactive={false}
    playInBackground={false}
    {...props}
    controls={false}
    source={{
      uri: props?.source,
      bufferConfig: {
        minBufferMs: 2500,
        maxBufferMs: 3000,
        bufferForPlaybackMs: 2500,
        bufferForPlaybackAfterRebufferMs: 2500,
      }
    }}
    ignoreSilentSwitch={'ignore'}
    hideShutterView
    shutterColor={'transparent'}
    style={[styles.videoStyleDefault, props.style]}
  />
}))

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerView: {
    width: theme.dimensions.deviceWidth,
    height: theme.dimensions.deviceHeight,
  },
  videoStyleDefault: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  viewOtherLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPlay: {
    width: 84,
    height: 84,
  }
});
