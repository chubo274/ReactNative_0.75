import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { CreateStreamButton } from './CreateStreamButton';
import { InfoFooter } from './InfoFooter';
import { InfoUserMainStream } from './InfoUserMainStream';
import { ListActionButton } from './ListActionButton';


export const ItemVideo = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = useStyles(theme, insets);

  return (
    <View style={styles.containerWrapper}>
      <InfoUserMainStream />
      <CreateStreamButton />
      <ListActionButton />
      <InfoFooter />
    </View>
  )
}

const useStyles = (theme: ITheme, insets: EdgeInsets) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    top: insets.top,
    paddingHorizontal: theme.dimensions.p16
  },
})