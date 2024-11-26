import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageSource from 'src/assets/images';
import { ButtonAction } from './ButtonAction';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { ModalReportBlur } from './ModalReportBlur';
import { Modalize } from 'react-native-modalize';
import { ModalShareBlur } from './ModalShareBlur';
import { ModalUserWatching } from './ModalUserWatching';
import BottomSheet from '@gorhom/bottom-sheet';

export const ListActionButton = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const refModalReportBlue = useRef<Modalize>()
  const refModalShareBlur = useRef<Modalize>()
  const bottomSheetModalRef = useRef<BottomSheet>(null)

  const listActionButton = [
    { id: 1, name: "like", icon: ImageSource.imageAiStream, count: '50' },
    { id: 2, name: "contact", icon: ImageSource.imageAiStream, count: '' },
    { id: 3, name: "share", icon: ImageSource.imageAiStream, count: '' },
    { id: 4, name: "shopping", icon: ImageSource.imageAiStream, count: '', onPress: () =>  bottomSheetModalRef.current?.snapToIndex(0)},
    { id: 5, name: "save", icon: ImageSource.imageAiStream, count: '', onPress: () => refModalShareBlur?.current?.open() },
    { id: 6, name: "more", icon: ImageSource.imageAiStream, count: '', onPress: () => refModalReportBlue?.current?.open() },
  ]

  return (
    <View style={styles.containerWrapper}>
      {listActionButton.map((item, index) => {
        return (
          <ButtonAction key={index} sourceIcon={item.icon} text={item.count} onPress={item?.onPress} />
        )
      })}

      <ModalReportBlur
        ref={refModalReportBlue}
      />
      <ModalShareBlur
        ref={refModalShareBlur}
      />
          <ModalUserWatching data={[1, 2, 3]} ref={bottomSheetModalRef} />

    </View>
  )
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
})