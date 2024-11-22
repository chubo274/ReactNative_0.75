import { useGetPokemon } from 'src/data/hooks/user/useGetPokemon';
import { backToTopAuthStack } from 'src/modules/navigation';
import { AppButton } from 'components/button/AppButton';
import { AppText } from 'components/text/AppText';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';
import { useGetSession, useSaveSession } from 'src/zustand/session';
import { useGetPersist, useSavePersist } from 'src/zustand/persist';

const HomeScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme)
  const { t } = useTranslation()
  const _useSaveSession = useSaveSession()
  const _useSavePersist = useSavePersist()
  const token = useGetPersist('Token')
  const pokemon = useGetSession('pokemon')
  const { fetch: fetchPokemon, data } = useGetPokemon()
  console.info('data', data)
  console.info('token', token)
  console.info('pokemon', pokemon)

  const onLogout = useCallback(() => {
    backToTopAuthStack()
  }, [])

  const callApi = useCallback(() => {
    fetchPokemon()
    _useSaveSession('pokemon', '123')
    _useSavePersist('Token', { token: 'token' })
  }, [fetchPokemon, _useSaveSession, _useSavePersist])

  return <View style={styles.container}>
    <AppText>Home</AppText>
    <AppButton
      title={t('logout')}
      onPress={onLogout}
      style={styles.btn}
    />
    <AppButton
      title={'change url login in repositories to test'}
      onPress={callApi}
      style={styles.btn}
    />
  </View>
}

export default HomeScreen

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
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
