import { FastFieldProps } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageSource from 'src/assets/images';
import { TxtTypo } from 'src/shared/helpers/enum';
import { parseStatusFormik } from 'src/shared/helpers/function';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { RenderImage } from '../image/RenderImage';
import { AppText } from '../text/AppText';
import { AppInput, IAppInput } from './AppInput';

interface IProps extends Omit<IAppInput, 'value'>, Omit<FastFieldProps, 'meta'> {
}

export const AppInputPassword = React.memo((props: IProps) => {
  const { field, form, ...rest } = props;
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const [isSecure, setIsSecure] = useState(true)

  const _isSecureMode = useMemo(() => Boolean(isSecure && field.value), [isSecure, field.value])
  const error = useMemo(() => form.errors[field.name] as string, [form.errors, field.name])
  const status = useMemo(() => parseStatusFormik(field.value, error, form.touched[field.name]), [field.value, error, form.touched, field.name])

  const widthIcon = theme.dimensions.makeResponsiveSize(24)
  const iconRight = useCallback(() => {
    return <TouchableOpacity activeOpacity={0.8} onPress={() => setIsSecure(!isSecure)}>
      <RenderImage svgMode source={isSecure ? ImageSource.octicon_eye_24 : ImageSource.icon_eye_closed} style={{ width: widthIcon, aspectRatio: 1 }} />
    </TouchableOpacity>
  }, [isSecure, widthIcon])

  const renderErrorMessage = useCallback(() => {
    if (status == 'error' && error)
      return <AppText typo={TxtTypo.Smallest_R} style={{ paddingTop: 4, color: 'red' }}>
        {error}
      </AppText>
  }, [status, error])

  return <View>
    <View>
      <AppInput
        value={field.value}
        onChangeText={form.handleChange(field.name)}
        status={status}
        // errorMessage={form.errors[field.name] as string}
        onFocus={() => {
          form.setFieldTouched(field.name)
        }}
        onClear={() => {
          form.setFieldValue(field.name, undefined)
        }}
        iconRight={iconRight}
        secureTextEntry={isSecure}
        inputStyle={[_isSecureMode && { color: 'transparent', fontSize: Platform.OS == 'android' ? 15 : 10 }]}
        {...rest}
      />
      {_isSecureMode && <View
        style={styles.viewSecureText}
        pointerEvents={'none'}>
        <View style={{ flexShrink: 1 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'clip'}
            style={{ color: theme.color.textColor.primary, fontSize: Platform.OS == 'android' ? 12 : undefined }}
          >
            {field.value?.replace(/./g, '*')}
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
