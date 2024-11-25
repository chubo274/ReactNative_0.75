import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

interface IProps extends BottomSheetProps {
  snapPoints: Array<string | number> | SharedValue<Array<string | number>>
}

export const AppBottomSheet = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { ...rest } = props;

  return <Portal>
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      {...rest}
    >
    </BottomSheet>
  </Portal>
}));
