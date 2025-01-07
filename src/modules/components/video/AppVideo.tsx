import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Video, { ReactVideoProps, ReactVideoSourceProperties, VideoRef } from 'react-native-video';
import ImageSource from 'src/assets/images';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';
import { useIsFocused } from '@react-navigation/native';

interface IProps extends IPropsRenderVideo {
  containerStyle?: ViewStyle
  thumbnail?: string
  layerContent?: React.JSX.Element
  isCurrent?: boolean
}

// controls rendervideo
export const AppVideo = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<VideoRef | null>) => {
  const theme = useAppTheme();
  const { paused = false, isCurrent, containerStyle, thumbnail, layerContent, ...rest } = props;
  const styles = useStyles(theme);

  // @ts-ignore
  // const refCurrent: VideoRef = ref?.current
  const [isPaused, setIsPaused] = useState<boolean>(Boolean(paused)) // for init state
  const isFocused = useIsFocused()

  const togglePlay = useCallback(() => {
    setIsPaused(!isPaused)
  }, [isPaused])

  useEffect(() => {
    setIsPaused((prev: boolean) => {
      if (prev != paused) return Boolean(paused);
      return prev
    })
  }, [paused])

  const renderVideo = useCallback(() => {
    const paused = !isFocused || !isCurrent || isPaused
    return <RenderVideo
      ref={ref}
      paused={paused}
      thumbnail={thumbnail}
      {...rest}
    />
  }, [ref, rest, thumbnail, isPaused, isCurrent, isFocused])

  const renderControllerVideo = useCallback(() => {
    const showControl = isFocused && isCurrent && isPaused
    if (showControl) {
      return <View style={styles.viewOtherLayer}>
        <RenderImage
          source={ImageSource.ic_play}
          style={styles.viewPlay}
          svgMode
        />
      </View>
    }
    return null;
  }, [isCurrent, isPaused, isFocused, styles])

  return <TouchableOpacity activeOpacity={1} style={[styles.containerView, containerStyle]} onPress={togglePlay}>
    {renderVideo()}
    {renderControllerVideo()}
    {layerContent}
  </TouchableOpacity>
}))

// sub common, dont need export
interface IPropsRenderVideo extends Omit<ReactVideoProps, 'source' | 'isFocus' | 'controls' | 'poster'> {
  source?: ReactVideoSourceProperties
  thumbnail?: string
}
const RenderVideo = React.memo(React.forwardRef((props: IPropsRenderVideo, ref: React.ForwardedRef<VideoRef | null>) => {
  const { source, thumbnail, ...rest } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return <Video
    ref={ref}
    resizeMode={'cover'}
    playWhenInactive={false}
    playInBackground={false}
    {...rest}
    controls={false}
    source={source}
    ignoreSilentSwitch={'ignore'}
    hideShutterView
    shutterColor={'transparent'}
    style={[styles.videoStyleDefault, props.style]}
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
