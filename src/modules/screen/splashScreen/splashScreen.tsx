import { AppText } from 'components/text/AppText';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';
import { backToTopAppStack, backToTopAuthStack } from 'src/modules/navigation';
import { useGetPersist } from 'src/zustand/persist';

const SplashScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const token = useGetPersist('Token')

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        backToTopAppStack()
      } else {
        backToTopAuthStack()
      }
    }, 300);
  }, [token])

  return <View style={styles.container}>
    <AppText>SplashScreen</AppText>
  </View>
}

export default SplashScreen

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
