import { backToTopAppStack } from 'src/modules/navigation';
import { AppButton } from 'components/button/AppButton';
import { AppText } from 'components/text/AppText';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';

const LoginScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme)
  const { t } = useTranslation()

  const onLogin = useCallback(() => {
    backToTopAppStack()
  }, [])

  return <View style={styles.container}>
    <AppText>Login</AppText>
    <AppButton
      title={t('login')}
      onPress={onLogin}
    />
  </View>
}

export default LoginScreen

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
