import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { AppStackParamList } from 'src/modules/navigation/AppParamsList'
import { useSavePersist } from 'src/zustand/persist'
import { useSaveSession } from 'src/zustand/session'

export const useLogout = () => {
  const savePersist = useSavePersist()
  const saveSession = useSaveSession()
  const navigation = useNavigation<StackNavigationProp<AppStackParamList, any>>()

  const logout = useCallback(() => {
    savePersist('Token', undefined);
    navigation.reset({
      index: 0,
      routes: [{ name: 'AppTab' }],
    });
  }, [savePersist, saveSession])

  return logout
}
