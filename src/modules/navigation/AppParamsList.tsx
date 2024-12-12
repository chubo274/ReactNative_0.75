export type AllRouteParamList = AppTabParamList & AppStackParamList & AuthStackParamList;

// stack in tab bar
export type AppTabParamList = {
    HomeScreen: undefined;
    ProfileScreen: undefined;
};

// all screen had auth
export type AppStackParamList = {
    AppTab: any;

    NotificationScreen?: { seen?: boolean };
};

// all screen no had auth
export type AuthStackParamList = {
    LoginScreen: undefined;
};

// navigate screen in stack example
// navigation.navigate('AppStackParamList', {
//   screen: 'NotificationScreen',
//   params: { 
//     seen: true
//   },
// });
