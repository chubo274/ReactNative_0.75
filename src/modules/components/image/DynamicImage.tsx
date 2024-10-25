import ImageSource from 'src/assets/images';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageResizeMode, ImageStyle, StyleProp, View } from 'react-native';
import { RenderImage } from './RenderImage';

interface IProps {
    source: string;
    maxHeight: number;
    preferSquareSize?: number;
    preferSquareSource?: string;
    style?: StyleProp<ImageStyle>;
    placeholderStyle?: any;
    resizeMode?: ImageResizeMode;
}

// TODO: Not ready for common use. Currently use in offer only
export const DynamicSizeImage = React.memo((props: IProps) => {
  const { style, placeholderStyle, resizeMode, source, maxHeight, preferSquareSize, preferSquareSource } = props;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Image.getSize(source, (_width: number, _height: number) => {
      setLoading(false);
      const ratio = _width / _height;
      // Consider is quare
      if (ratio > 0.9 && ratio < 1.1 && preferSquareSize) {
        setWidth(preferSquareSize);
        setHeight(preferSquareSize);
        return;
      }
      const height = maxHeight;
      const width = height * ratio;
      setWidth(width);
      setHeight(height);
    }, error => {
      setLoading(false);
    });
  }, [source, setWidth, setHeight, maxHeight, preferSquareSize]);

  if (loading) {
    return <View style={{ height: 30, width: 30 }}>
      <ActivityIndicator animating size={'small'} color={'gray'} />
    </View>;
  }

  if (!width || !height) {
    return <RenderImage
      style={[{ height: 30, width: 30 }, placeholderStyle]}
      resizeMode="contain"
      source={ImageSource.img_fallback}
    />
  }

  return <RenderImage
    style={[style, { width, height }]}
    resizeMode={resizeMode ?? 'contain'}
    source={width === height && preferSquareSource ? preferSquareSource : source}
  />
});
