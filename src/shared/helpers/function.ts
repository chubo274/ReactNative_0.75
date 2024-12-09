import { IAppToast } from 'components/toast/AppToast'
import { DeviceEventEmitter, Share, ShareAction } from 'react-native'
import ZustandPersist, { ISessionStorage } from 'src/zustand/persist'
import { EmitType } from './constant'

/// parse formData for body api
export const parseFormData = (data: any, keepFormData?: boolean): FormData => {
  const bodyFormData = new FormData()
  Object.keys(data).forEach((key: string) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((value: any) => {
        bodyFormData.append(`${key}[]`, value)
      })
    } else {
      bodyFormData.append(key, data[key])
    }
  })
  return bodyFormData
}

export const setTokenUser = (sessionStorage: ISessionStorage) => {
  return ZustandPersist.getState()?.save('Token', sessionStorage)
}

// parseMaxLengthText
export const maxLengthText = (maxLengthText: number, string?: string) => {
  if (!string) {return ''}
  if (string && string.length <= maxLengthText) {return string}
  return string.substring(0, maxLengthText) + '...'
}

// EventEmitter
export const emitShowToast = (params: IAppToast) => {
  DeviceEventEmitter.emit(EmitType.AppToast, params)
}

export const emitShowAppLoading = (isShow: boolean) => {
  DeviceEventEmitter.emit(EmitType.AppLoading, isShow)
}

// Share function
interface IShareParams {
  title?: string,
  message: string,
  url: string,
}
export const shareByDevice = (params: IShareParams, onSuccess?: (e?: any) => void, onFail?: (e?: any) => void) => {
  Share.share(params).then((result: ShareAction) => {
    if (result.action === Share.sharedAction) {
      switch (result.activityType) {
        case 'com.apple.UIKit.activity.CopyToPasteboard':
          emitShowToast({ type: 'Success', toastMessage: getString('copySuccess') })
          break;
        default:
          onSuccess?.(result)
          break;
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      onFail?.(result)
    }
  }).catch((error: any) => {
    console.info(error.message);
  })
};

// Formik
export const parseStatusFormik = (values: any, errors: FormikErrors<any>, touched: any, key: string) => {
  if (errors[key] && touched[key]) return 'error'
  if (typeof values[key] === 'number' && values[key] !== null) return 'success'
  if (values[key] && !errors[key]) return 'success'
  return undefined
}
