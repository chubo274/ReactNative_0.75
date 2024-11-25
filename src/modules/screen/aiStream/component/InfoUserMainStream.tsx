import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AvatarAiStream } from './AvatarAiStream';
import { AppText } from 'src/modules/components/text/AppText';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { TxtTypo } from 'src/shared/helpers/enum';

export const InfoUserMainStream = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.imgWrapper}>
        <AvatarAiStream size={42} source={{ uri: 'https://picsum.photos/200' }} />
        <AppText typo={TxtTypo.Smallest_M} style={{ paddingLeft: theme.dimensions.p6, color: theme.color.white }}>Ramic Mature</AppText>
      </View>
      <TouchableOpacity style={styles.btnFollow} activeOpacity={0.8}  >
        <AppText style={styles.txtFollow}>Follow</AppText>
        <AppText style={{
          paddingLeft: theme.dimensions.p4, color: theme.color.primary[500],
          fontWeight: '500',
          fontSize: theme.fontSize.p14,
          lineHeight: 14
        }}>+</AppText>
      </TouchableOpacity>
    </View>
  )
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: "center",
  },
  imgWrapper: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
  },
  btnFollow: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: theme.dimensions.p16,
    paddingVertical: theme.dimensions.p6,
    flexDirection: 'row',
    borderRadius: theme.dimensions.p6
  },
  txtFollow: {
    color: theme.color.primary[500],
    fontWeight: '500',
    fontSize: theme.fontSize.p12,
    lineHeight: 14
  }
})