import { StyleSheet } from 'react-native'

export const globalShadowStyle = StyleSheet.create({
  offShadow: {
    shadowColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 0,
  },

  shadow: {
    shadowColor: '#083070',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.08,
    elevation: 2.5,
  },
})
