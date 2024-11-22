import { AppText } from 'components/text/AppText';
import React from 'react';
import { Keyboard, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import { ITheme, useAppTheme } from 'shared/theme';

interface IProps extends ModalizeProps {
    disableScroll?: boolean;
    childrenStyle?: ViewStyle;
    titleHeader?: string;
    titleHeaderStyle?: TextStyle;
    hideViewHolder?: boolean;
}

export const AppModal = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<IHandles | null>) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { disableScroll, childrenStyle, children, HeaderComponent, modalStyle, titleHeader, hideViewHolder, onOverlayPress, titleHeaderStyle, ...rest } = props;

  return (
    <Portal>
      <Modalize
        ref={ref}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'never',
          showsVerticalScrollIndicator: false,
        }}
        {...rest}
        panGestureEnabled={!disableScroll}
        onOverlayPress={() => {
          Keyboard.dismiss()
          onOverlayPress?.()
        }}
        withHandle={false}
        childrenStyle={[styles.childrenStyle, childrenStyle]}
        HeaderComponent={<>
          {hideViewHolder ? <View /> : <View style={styles.viewHolder} />}
          {titleHeader ? <AppText style={[styles.titleHeader, titleHeaderStyle]}>{titleHeader}</AppText> : null}
          {HeaderComponent}
        </>}
        modalStyle={[styles.defaultModalStyle, modalStyle]}
      >
        {children}
      </Modalize>
    </Portal>
  );
}));

const useStyles = (theme: ITheme) => StyleSheet.create({
  viewHolder: {
    backgroundColor: '#CACFDA',
    borderRadius: 2,
    height: 4,
    width: 32,
    alignSelf: 'center',
    marginTop: theme.dimensions.p6,
    marginBottom: theme.dimensions.p6,
  },
  defaultModalStyle: {
    borderTopLeftRadius: theme.dimensions.p16,
    borderTopRightRadius: theme.dimensions.p16,
  },
  childrenStyle: {
    paddingBottom: theme.dimensions.p20,
  },
  titleHeader: {
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 10
  }
});
