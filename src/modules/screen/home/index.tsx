// import { useGetPokemon } from 'src/data/hooks/user/useGetPokemon';
import { backToTopAuthStack } from 'src/modules/navigation';
import { AppButton } from 'components/button/AppButton';
import { AppText } from 'components/text/AppText';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';
import { RenderImage } from 'src/modules/components/image/RenderImage';
import { Bell, Ticket } from 'phosphor-react-native';
import ImageSource from 'src/assets/images';
// import { useGetSession, useSaveSession } from 'src/zustand/session';
// import { useGetPersist, useSavePersist } from 'src/zustand/persist';

const HomeScreen = () => {
  const theme = useAppTheme();
  const styles = useStyles(theme)
  const { t } = useTranslation()
  // const _useSaveSession = useSaveSession()
  // const _useSavePersist = useSavePersist()
  // const token = useGetPersist('Token')
  // const pokemon = useGetSession('pokemon')
  // const { fetch: fetchPokemon, data } = useGetPokemon()
  // console.info('data', data)
  // console.info('token', token)
  // console.info('pokemon', pokemon)

  const onLogout = useCallback(() => {
    backToTopAuthStack()
  }, [])

  // const callApi = useCallback(() => {
  //   fetchPokemon()
  //   _useSaveSession('pokemon', '123')
  //   _useSavePersist('Token', { token: 'token' })
  // }, [fetchPokemon, _useSaveSession, _useSavePersist])

  return <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.left_header}>
        <RenderImage svgMode source={ImageSource.tea} style={{ width: theme.dimensions.makeResponsiveSize(40), height: theme.dimensions.makeResponsiveSize(40) }} />
        <View style={{width: 5}} />
        <AppText>{t('helloNewFriend')}</AppText>
        <View style={{width: 5}} />
        <RenderImage svgMode source={ImageSource.wavehand} style={{ width: theme.dimensions.makeResponsiveSize(40), height: theme.dimensions.makeResponsiveSize(40) }} />
      </View>
      <View style={styles.right_header}>
        <TouchableOpacity activeOpacity={0.8} style={styles.voucher_btn}>
          <Ticket color='#cd853f' size={20} weight="light" />
        </TouchableOpacity>
        <View style={{width: 5}} />
        <TouchableOpacity activeOpacity={0.8} style={styles.notification_btn}>
          <Bell size={20} weight="light" />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView>

    </ScrollView>
    {/* <AppText>Home</AppText> */}
    
  </View>
}

export default HomeScreen

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5, 
  },
  left_header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right_header: {
    // flex: 1,
    flexDirection: 'row',
  },
  voucher_btn: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification_btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: 'transparent',
    height: 48,
    borderWidth: 1,
    borderColor: 'yellow',
    marginBottom: 12,
  }
})
