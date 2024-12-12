import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetProps, SNAP_POINT_TYPE } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { useCallback, useRef } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

interface IProps extends BottomSheetProps {
  snapPoints: Array<string | number> | SharedValue<Array<string | number>>
  backdropOpacity?: number
  onOpen?: () => void
}

export const AppModal = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { backdropOpacity, onOpen, onChange, ...rest } = props;
  const currentSnapIndex = useRef<number>(-1); // Track current index

  const close = useCallback(() => {
    // @ts-ignore
    ref?.current!.close()
  }, [ref])

  const onChangeSnapPoint = useCallback((index: number, position: number, type: SNAP_POINT_TYPE) => {
    const hasOpened = currentSnapIndex.current === -1 && index >= 0;
    // const hasClosed = index === -1;

    if (hasOpened) {
      onOpen?.()
    }
    onChange?.(index, position, type)
    currentSnapIndex.current = index
  }, [currentSnapIndex, onChange])

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={(Number(backdropOpacity) > -1) ? backdropOpacity : 0.5}
    >
      <TouchableWithoutFeedback onPress={close}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
    </BottomSheetBackdrop>
  ), [close, backdropOpacity]);

  return <Portal>
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onChange={onChangeSnapPoint}
      {...rest}
    >
    </BottomSheet>
  </Portal>
}));
