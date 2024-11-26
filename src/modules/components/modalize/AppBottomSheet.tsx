import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetProps } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { useCallback } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

interface IProps extends BottomSheetProps {
  snapPoints: Array<string | number> | SharedValue<Array<string | number>>
  backdropOpacity?: number
}

export const AppBottomSheet = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { backdropOpacity, ...rest } = props;

  const close = useCallback(() => {
    // @ts-ignore
    ref?.current!.close()
  }, [ref])

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={backdropOpacity ? backdropOpacity : 0.5}
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
      {...rest}
      // backdropComponent={(props) => <BottomSheetBackdrop
      //   {...props}
      //   appearsOnIndex={0}
      //   disappearsOnIndex={-1}
      //   opacity={0.5}
      // />}
    >
    </BottomSheet>
  </Portal>
}));