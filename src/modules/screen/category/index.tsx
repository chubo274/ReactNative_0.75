import { AppText } from 'components/text/AppText';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';

const CategoryScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme)

  return <View style={styles.container}>
    <AppText>Category</AppText>
  </View>
}

export default CategoryScreen

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'transparent',
    height: 48,
    borderWidth: 1,
    borderColor: 'yellow',
    marginBottom: 12,
  }
})
