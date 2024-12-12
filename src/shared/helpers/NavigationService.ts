import { CommonActions, NavigationContainerRef, NavigationState, PartialState, Route, StackActions } from '@react-navigation/native'
import { AllRouteParamList } from 'src/modules/navigation/AppParamsList'

type AllRoutes = keyof AllRouteParamList

declare type ResetState = PartialState<NavigationState> | NavigationState | (Omit<NavigationState, 'routes'> & {
    routes: Array<Omit<Route<string>, 'key'>>
})
export default class NavigationService {
  static topLevelNavigator?: NavigationContainerRef<any>

  static setTopLevelNavigator = (ref: NavigationContainerRef<any>) => NavigationService.topLevelNavigator = ref

  static reset = (resetState: ResetState | undefined) => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        CommonActions.reset(resetState)
      );
    }
  };

  static navigate = (routeName: AllRoutes, params?: any) => {
    if ((NavigationService.topLevelNavigator != null) && routeName) {
      NavigationService.topLevelNavigator.dispatch(
        CommonActions.navigate({
          name: routeName.toString(),
          params
        })
      );
    }
  };

  static push = (routeName: AllRoutes, params?: any) => {
    if ((NavigationService.topLevelNavigator != null) && routeName) {
      NavigationService.topLevelNavigator.dispatch(
        StackActions.push(routeName.toString(), params)
      );
    }
  };

  static pop = () => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        CommonActions.goBack()
      );
    }
  };

  static popToTop = () => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        StackActions.popToTop()
      );
    }
  };

  static replace = (routeName: AllRoutes, params?: any) => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        StackActions.replace(routeName.toString(), params)
      );
    }
  };
}
