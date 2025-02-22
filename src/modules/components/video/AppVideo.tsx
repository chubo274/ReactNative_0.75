import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Video, { ReactVideoProps, ReactVideoSourceProperties, VideoRef } from 'react-native-video';
import ImageSource from 'src/assets/images';
import Closure from 'src/shared/helpers/Closure';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';

interface IPropsRenderVideo extends Omit<ReactVideoProps, 'source' | 'isFocus' | 'controls' | 'poster'> {
  source?: ReactVideoSourceProperties
  thumbnail?: string
}

interface IProps extends IPropsRenderVideo {
  containerStyle?: ViewStyle
  thumbnail?: string
  layerContent?: React.JSX.Element
  doubleTap?: () => void
}

const closure = new Closure()
// controls rendervideo
export const AppVideo = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<VideoRef | null>) => {
  const theme = useAppTheme();
  const { paused = false, containerStyle, thumbnail, layerContent, source, doubleTap, ...rest } = props;
  const styles = useStyles(theme);

  const [isPaused, setIsPaused] = useState<boolean>(Boolean(paused)) // for init state
  const [isShowController, setIsShowController] = useState<boolean>(false)
  const [isBuffering, setIsBuffering] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPaused(!isPaused)
    setIsShowController(!isPaused)
  }, [isPaused])

  const handleTapOnVideo = useCallback(() => {
    if (doubleTap) {
      closure.handleTap(togglePlay, doubleTap)
    } else {
      togglePlay()
    }
  }, [togglePlay, doubleTap])

  useEffect(() => {
    setIsShowController(false)
    setIsPaused((prev: boolean) => {
      if (prev != paused) return Boolean(paused);
      return prev
    })
  }, [paused])

  const renderVideo = useCallback(() => {
    return <Video
      ref={ref}
      resizeMode={'cover'}
      playWhenInactive={false}
      {...rest}
      playInBackground={true} // Keep video loaded
      paused={isPaused}
      controls={false}
      source={source}
      ignoreSilentSwitch={'ignore'}
      hideShutterView
      shutterColor={'transparent'}
      style={[styles.videoStyleDefault, props.style]}
      onBuffer={({ isBuffering }) => {
        closure.debounce(() => setIsBuffering(isBuffering), 200)
        if (!isBuffering && closure?.timer) {
          clearTimeout(closure.timer)
          setIsBuffering(false)
        }
      }}
      poster={thumbnail ? {
        source: {
          uri: thumbnail,
        },
        resizeMode: 'cover',
        style: {
          width: '100%',
          height: '100%'
        }
      } : undefined}
      viewType={1} // 1 = ViewType.SURFACE (better performance)
    />
  }, [ref, rest, thumbnail, isPaused, source, styles.videoStyleDefault, props.style])

  const renderControllerVideo = useCallback(() => {
    if (!isShowController && !isBuffering) return null
    return <View style={styles.viewOtherLayer}>
      {isBuffering && <RenderImage source={ImageSource.gif_Ellipsis} style={styles.imgGif} />}
      {(isShowController && !isBuffering) && <RenderImage
        source={ImageSource.ic_play}
        style={styles.viewPlay}
        svgMode
      />}
    </View>
  }, [isShowController, styles, isBuffering])

  return <TouchableOpacity
    activeOpacity={1}
    disabled={isBuffering}
    style={[styles.containerView, containerStyle]}
    onPress={handleTapOnVideo}
  >
    {renderVideo()}
    {renderControllerVideo()}
    {layerContent}
  </TouchableOpacity>
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
  },
  imgGif: {
    width: 80,
    height: 40,
  },
});
