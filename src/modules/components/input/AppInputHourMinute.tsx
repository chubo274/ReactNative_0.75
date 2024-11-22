import { AppButton } from 'components/button/AppButton';
import { AppModal } from 'components/modalize/AppModal';
import { AppText } from 'components/text/AppText';
import moment, { Moment } from 'moment';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Modalize } from 'react-native-modalize';
import { ITheme, useAppTheme } from 'shared/theme';

interface IProps {
    title?: string;
    requireField?: boolean;
    timeSelected?: string | Moment;
    maxHour?: string | Moment;
    minHour?: string | Moment;
    onChangeTime?: (hour: number, min: number) => void,
    textTimeStyle?: StyleProp<TextStyle>
    disabled?: boolean
    onFocus?: () => void
    onOpen?: () => void
}


export const InputHourMinute = React.memo((props: IProps) => {
  const { onFocus, onOpen, timeSelected, onChangeTime, requireField, title, maxHour, minHour, textTimeStyle, disabled } = props
  const { t } = useTranslation()
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const refDataTime = useRef<Date>(moment(timeSelected).toDate())

  const refHourMinute = useRef<Modalize>(null)

  const _textTimeStyle = useMemo((): StyleProp<TextStyle> => {
    if (disabled) {
      return {
        color: theme.color.textColor.disable,
        fontSize: theme.fontSize.p15,
        paddingLeft: theme.dimensions.makeResponsiveSize(60),
        flex: 1
      }
    }
    return textTimeStyle ? textTimeStyle : styles.textStyle
  }, [disabled, styles.textStyle, textTimeStyle, theme.color.textColor.disable, theme.dimensions, theme.fontSize.p15])

  const _onOpen = useCallback(() => {
    onFocus?.()
    onOpen?.()
  }, [onOpen, onFocus])

  return <View style={styles.containerWrapperStyle}>
    {title ? <AppText style={styles.labelInput}>
      {requireField ? <AppText style={styles.requireFieldStyle}> *</AppText> : null} {title}
    </AppText> : null}

    <TouchableOpacity style={[styles.containerStyle, disabled && { backgroundColor: theme.color.bg.disable }]} onPress={() => refHourMinute.current?.open()} activeOpacity={0.8}>
      <View style={styles.hourMinuteContainer}>
        <AppText style={_textTimeStyle}>{moment(timeSelected).hours() > 9 ? '' : 0}{moment(timeSelected).hours()}</AppText>
        <AppText style={styles.hourMinuteStyle}>:</AppText>
      </View>
      <View style={styles.hourMinuteContainer}>
        <AppText style={_textTimeStyle}>{moment(timeSelected).minutes() > 9 ? '' : 0}{moment(timeSelected).minutes()}</AppText>
      </View>
    </TouchableOpacity>

    <AppModal
      refModal={refHourMinute}
      onOpen={_onOpen}
      scrollViewProps={{ scrollEnabled: false }}
      adjustToContentHeight
      titleHeader={t('time')}
    >
      <View style={styles.containerChildrenPopUp}>
        <DatePicker
          style={{ marginLeft: theme.dimensions.p8 }}
          date={moment(timeSelected).toDate()}
          theme={'light'}
          mode="time"
          locale={'en_GB'}
          onDateChange={(date) => {
            refDataTime.current = date
          }}
          maximumDate={moment(maxHour ?? null)?.isValid() ? moment(maxHour).toDate() : undefined}
          minimumDate={moment(minHour ?? null)?.isValid() ? moment(minHour).toDate() : undefined}
        />
        <View style={styles.buttonWrapper}>
          <AppButton
            text={t('done')}
            style={styles.buttonStyleSubmitModal}
            textStyle={styles.textButton}
            onPress={() => {
              onChangeTime?.(moment(refDataTime.current).hours(), moment(refDataTime.current).minutes())
              refHourMinute?.current?.close()
            }}
          />
        </View>
      </View>
    </AppModal>
  </View>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerWrapperStyle: {

  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.color.bg.input_p1,
    paddingHorizontal: theme.dimensions.p10,
    paddingVertical: theme.dimensions.p12,
    borderRadius: 4,
    alignItems: 'center'
  },
  hourMinuteStyle: {
    fontSize: theme.fontSize.p11,
    color: theme.color.textColor.secondary,
    lineHeight: 24
  },
  labelInput: {
    marginBottom: 4,
    color: theme.color.textColor.secondary,
    fontSize: theme.fontSize.p11,
    fontFamily: theme.font.Medium,
    lineHeight: theme.dimensions.p16,
  },
  requireFieldStyle: {
    color: theme.color.function.error.primary,
    fontSize: theme.fontSize.p11,
  },
  textStyle: {
    color: theme.color.brand.primary,
    fontSize: theme.fontSize.p15,
    paddingLeft: theme.dimensions.makeResponsiveSize(60),
    flex: 1
  },
  hourMinuteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-between'
  },
  defaultHelperText: {
    marginTop: theme.dimensions.p2,
    color: theme.color.function.error.primary,
    fontSize: theme.fontSize.p11,
  },
  containerChildrenPopUp: {
    backgroundColor: theme.color.white,
    borderRadius: theme.dimensions.p8,
    maxHeight: theme.dimensions.deviceHeight * 0.75,
    alignItems: 'center'
  },
  buttonStyleSubmitModal: {
    backgroundColor: theme.color.brand.primary,
  },
  textButton: {
    color: theme.color.brand.white,
    fontSize: theme.fontSize.p15,
    fontFamily: theme.font.Bold,
    lineHeight: 24
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: theme.dimensions.p16,
    marginTop: theme.dimensions.p24,
    marginBottom: theme.dimensions.p16
  }
});
