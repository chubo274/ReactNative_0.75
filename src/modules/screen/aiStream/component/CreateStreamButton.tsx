import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageSource from 'src/assets/images';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { AppText } from 'src/modules/components/text/AppText';
import { ITheme, useAppTheme } from 'src/shared/theme';

export const CreateStreamButton = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.containerWrapper}>
      <TouchableOpacity style={{ backgroundColor: theme.color.blackBlurColor04, flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.dimensions.p16, paddingVertical: theme.dimensions.p8, borderRadius: 100 }}>
          <RenderImage svgMode source={ImageSource.imageAiStream} style={{ width: theme.dimensions.p24, height: theme.dimensions.p24 }} />
          <AppText style={{paddingLeft: theme.dimensions.p6, fontSize: theme.dimensions.p14, fontWeight: '500', lineHeight: 16, color: '#FFFF'}}>Create Stream</AppText>
      </TouchableOpacity>
    </View>
  )
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: theme.dimensions.makeResponsiveSize(48), 
    marginTop: theme.dimensions.p16
  },


})