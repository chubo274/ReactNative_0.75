import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AvatarAiStream } from './AvatarAiStream';
import { AppText } from 'src/modules/components/text/AppText';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { InfoUserMainStream } from './InfoUserMainStream';
import { CreateStreamButton } from './CreateStreamButton';
import { ListActionButton } from './ListActionButton';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoFooter } from './InfoFooter';


export const ItemVideo = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = useStyles(theme, insets);

  return (
    <View style={styles.containerWrapper}>
      <InfoUserMainStream />
      <CreateStreamButton/>
      <ListActionButton/>
      <InfoFooter/>
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