import * as React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

function FocusAwareStatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

export default FocusAwareStatusBar
