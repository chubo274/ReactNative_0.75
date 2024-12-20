import React from 'react'
import { AppInput, IAppInput } from './AppInput'
import { FastFieldProps } from 'formik'
import { parseStatusFormik } from 'src/shared/helpers/function';

interface IProps extends IAppInput, Omit<FastFieldProps, 'meta'> {

}

export const FastFieldInput = React.memo((props: IProps) => {
  const { field, form, ...rest } = props;
  return <AppInput
    value={field.value}
    onChangeText={form.handleChange(field.name)}
    status={parseStatusFormik(field.value, form.errors[field.name], form.touched[field.name])}
    errorMessage={form.errors[field.name] as string}
    onFocus={() => {
      form.setFieldTouched(field.name)
    }}
    onClear={() => {
      form.setFieldValue(field.name, undefined)
    }}
    {...rest}
  />
})
