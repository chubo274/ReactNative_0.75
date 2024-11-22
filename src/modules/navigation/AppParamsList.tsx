
// stack in tab bar
export type AppTabParamList = {
    HomeTab: undefined;
    CartTab: undefined;
    AiStreamTab: undefined;
    CategoryTab: undefined;
    ProfileTab: undefined;
};

// all screen had auth
export type AppStackParamList = {
    AppTab: undefined;
    HomeScreen: undefined;
    ProfileScreen: undefined;
} & AppTabParamList;

// all screen no had auth
export type AuthStackParamList = {
    LoginScreen: undefined;
};

export type AllRouteParamList = AppStackParamList & AuthStackParamList;
