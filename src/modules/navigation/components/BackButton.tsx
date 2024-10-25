import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import NavigationService from 'shared/helpers/NavigationService';
import { ITheme, useAppTheme } from 'shared/theme';


interface IProps {
    tintColor?: any;
    onPress?: () => void
}

export const BackButton = React.memo((props: IProps) => {
  const { onPress } = props;
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const _onPress = useCallback(() => {
    if (onPress) {return onPress()}
    NavigationService.pop()
  }, [onPress])

  return <TouchableOpacity
    style={styles.container}
    hitSlop={{
      top: 10,
      right: 10,
      left: 10,
      bottom: 10
    }}
    onPress={_onPress}
    activeOpacity={0.8}
  >
    {/* <Icon name={'bell'} size={16} color={tintColor}/> */}
  </TouchableOpacity>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -6,
  },
})
