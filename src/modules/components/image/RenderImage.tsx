import ImageSource from 'src/assets/images';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import FastImage, { FastImageProps, ResizeMode } from 'react-native-fast-image';
import { LocalSvg } from 'react-native-svg/css';

// @ts-ignore
interface IProps extends FastImageProps {
    svgMode?: boolean
    source?: ImageSourcePropType | string,
    resizeMode?: ResizeMode
    fallBackSource?: string
}

export const RenderImage = memo((props: IProps) => {
  const { svgMode, source, resizeMode = 'contain', fallBackSource, ...rest } = props;
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (typeof source === 'string') {
      setIsError(false)
    }
  }, [source])

  const renderSource = useMemo(() => {
    const copy = source
    if (isError) {return fallBackSource || ImageSource.img_fallback;}
    if (!source) {return fallBackSource || ImageSource.img_fallback;}
    if (typeof source === 'string') {
      return { uri: copy }
    }
    return source
  }, [source, isError, fallBackSource])

  if (svgMode) {
    let style = {}
    if (props?.style && Array.isArray(props?.style) && props?.style?.length > 0) {
      props?.style.forEach((el: any) => {
        style = { ...style, ...el }
      })
    }
    if (props?.style && !Array.isArray(props?.style)) {
      style = props?.style
    }
    // @ts-ignore
    let width = style?.width; let height = style?.height; const aspectRatio = style?.aspectRatio
    if (aspectRatio) {
      width = width ? width : height * aspectRatio
      height = height ? height : width / aspectRatio
    }
    return <LocalSvg
      // @ts-ignore
      asset={source}
      width={width}
      height={height}
    />
  }

  return <FastImage
    {...rest}
    source={renderSource}
    resizeMode={resizeMode}
    onError={() => {
      if (!isError) {
        setIsError(true);
      }
    }}
  />
})
