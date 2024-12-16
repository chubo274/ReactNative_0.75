import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageSource from 'src/assets/images';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';
import { AppInput, IAppInput } from './AppInput';
import { AppText } from '../text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';

interface IProps extends IAppInput {
  value?: string
}

export const AppInputPassword = React.memo((props: IProps) => {
  const { value, status, errorMessage } = props;
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const [isSecure, setIsSecure] = useState(true)

  const _isSecureMode = useMemo(() => Boolean(isSecure && value), [isSecure, value])

  const widthIcon = theme.dimensions.makeResponsiveSize(24)
  const iconRight = useCallback(() => {
    return <TouchableOpacity activeOpacity={0.8} onPress={() => setIsSecure(!isSecure)}>
      <RenderImage svgMode source={isSecure ? ImageSource.octicon_eye_24 : ImageSource.icon_eye_closed} style={{ width: widthIcon, aspectRatio: 1 }} />
    </TouchableOpacity>
  }, [isSecure, widthIcon])

  const renderErrorMessage = useCallback(() => {
    if (status == 'error' && errorMessage)
      return <AppText typo={TxtTypo.Smallest_R} style={{ paddingTop: 4, color: 'red' }}>
        {errorMessage}
      </AppText>
  }, [status, errorMessage])

  return <View>
    <View>
      <AppInput
        {...props}
        errorMessage={''}
        iconRight={iconRight}
        value={value}
        secureTextEntry={isSecure}
        inputStyle={[_isSecureMode && { color: 'transparent', fontSize: 10, }]}
      />
      {_isSecureMode && <View
        style={styles.viewSecureText}
        pointerEvents={'none'}>
        <View style={{ flexShrink: 1 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'clip'}
            style={{color: theme.color.textColor.primary}}
          >
            {value?.replace(/./g, '*')}
          </Text>
        </View>
        <View style={{ opacity: 0 }}>
          <View style={{ width: widthIcon + 4 + 16 }} />
        </View>
      </View>}
    </View>
    {renderErrorMessage()}
  </View>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  viewSecureText: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: theme.dimensions.p6,
    paddingHorizontal: theme.dimensions.p16,
  }
})
