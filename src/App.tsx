/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import {
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import { ImageLoading } from 'components/image/ImageLoading';
import { AppToast } from 'components/toast/AppToast';
import React, { useRef } from 'react';
import { Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import NavigationService from 'shared/helpers/NavigationService';
import ThemeProvider from 'shared/theme';
import RootStack from './modules/navigation';
import { LANGUAGES } from './shared/helpers/enum';
import { configureLocalization } from './shared/localization';

export const appState = {
  initializeReady: false,
};

const App = () => {
  const routeNameRef = useRef();
  const navigationRef = useRef<any>();
  configureLocalization(LANGUAGES.ENGLISH);

  return <ThemeProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={(ref: NavigationContainerRef<any>) => {
          NavigationService.setTopLevelNavigator(ref);
          navigationRef.current = ref;
        }}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {

          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            // await analytics().logScreenView({
            //     screen_name: currentRouteName,
            //     screen_class: currentRouteName,
            // });
          }

        }}
      >
        <PortalProvider>
          <StatusBar barStyle={Platform.select({ android: 'light-content', ios: 'dark-content', })} />
          <AppToast />
          <RootStack />
          <ImageLoading />
        </PortalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  </ThemeProvider>
};

export default App;
