import { format, isValid, parse } from 'date-fns';
import { FastFieldProps } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import ImageSource from 'src/assets/images';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppInput, IAppInput } from 'src/modules/components/input/AppInput';
import { DateTimeFormat } from 'src/shared/helpers/enum';
import { parseStatusFormik } from 'src/shared/helpers/function';
import { useAppTheme } from 'src/shared/theme';

interface IProps extends Pick<IAppInput, 'status' | 'textLabel' | 'placeholder' | 'errorMessage' | 'onChangeText'>, FastFieldProps {
  valueShowFormat?: DateTimeFormat
  maximumDate?: Date
  minimumDate?: Date
}

export const AppInputDatePicker = (props: IProps) => {
  const { field, form, valueShowFormat = DateTimeFormat?.DateTime, placeholder, textLabel, maximumDate, minimumDate } = props;
  const theme = useAppTheme();
  const defaultDate = useMemo(() => {
    return isValid(field.value) ? parse(field.value, valueShowFormat, new Date()) : undefined
  }, [field.value, valueShowFormat]);

  const [dateSelected, setDateSelected] = useState(defaultDate)
  const [open, setOpen] = useState(false)

  const onPressInput = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const selectedDate = useCallback((date: Date) => {
    const formattedDate = format(date, valueShowFormat);
    form.setFieldValue(field.name, formattedDate)
    setDateSelected(date);
  }, [form, field.name, valueShowFormat]);

  return <TouchableOpacity activeOpacity={0.8} onPress={onPressInput}>
    <AppInput
      value={field.value}
      onChangeText={form.handleChange(field.name)}
      status={parseStatusFormik(field.value, form.errors[field.name], form.touched[field.name])}
      errorMessage={form.errors[field.name] as string}
      onFocus={() => {
        form.setFieldTouched(field.name)
      }}
      placeholder={placeholder}
      textLabel={textLabel}
      iconRight={() => <RenderImage svgMode source={ImageSource.lets_icons_date} style={{ width: theme.dimensions.makeResponsiveSize(20), height: theme.dimensions.makeResponsiveSize(20) }} />}
      pointerEvents={'none'}
    />
    <DatePicker
      modal
      mode='date'
      open={open}
      date={dateSelected || new Date()}
      onConfirm={(date) => {
        setOpen(false)
        selectedDate(date)
      }}
      onCancel={() => {
        setOpen(false)
      }}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  </TouchableOpacity>
}
