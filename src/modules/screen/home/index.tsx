import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppButton } from 'components/button/AppButton';
import { AppText } from 'components/text/AppText';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';
import { useGetPokemon } from 'src/data/hooks/user/useGetPokemon';
import { AppStackParamList } from 'src/modules/navigation/AppParamsList';
import { useGetPersist, useSavePersist } from 'src/zustand/persist';
import { useGetSession, useSaveSession } from 'src/zustand/session';
import { ModalUserWatching } from '../aiStream/component/ModalUserWatching';
import { ItemUserFollow } from '../aiStream/component/ItemUserFollow';

const HomeScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme)
  const { t } = useTranslation()
  const _useSaveSession = useSaveSession()
  const _useSavePersist = useSavePersist()
  const token = useGetPersist('Token')
  const pokemon = useGetSession('pokemon')
  const bottomSheetModalRef = useRef<BottomSheet>(null)
  const { fetch: fetchPokemon, data } = useGetPokemon()
  console.info('data', data)
  console.info('token', token)
  console.info('pokemon', pokemon)
  const navigation = useNavigation<StackNavigationProp<AppStackParamList, 'AiStreamScreen'>>()
  const dataAbc = [
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
  ]
  const onLogout = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(0)
  }, [])

  const callApi = useCallback(() => {
    fetchPokemon()
    _useSaveSession('pokemon', '123')
    _useSavePersist('Token', { token: 'token' })
  }, [fetchPokemon, _useSaveSession, _useSavePersist])

  const navigateToAiStream = useCallback(() => {
    navigation.navigate('AiStreamScreen')
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
    <AppButton
      title={'navigate to ai stream '}
      onPress={navigateToAiStream}
      style={styles.btn}
    />
    <ModalUserWatching data={[1, 2, 3]} ref={bottomSheetModalRef} />
    {dataAbc?.map((el) => {
      return (
        <ItemUserFollow name={el?.name} numberOfFollow={el?.numberFollow} uri={el?.uri} />
      )
    })}
  </View>
}

export default HomeScreen

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  btn: {
    backgroundColor: 'transparent',
    height: 48,
    borderWidth: 1,
    borderColor: 'yellow',
    marginBottom: 12,
  }
})
