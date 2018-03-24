import { StackNavigator } from 'react-navigation'
import MapScreen from '../Containers/MapScreen'
import Incidents from '../Containers/Incidents'
import AboutScreen from '../Containers/AboutScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import RegisterScreen from '../Containers/RegisterScreen'
import LoginScreen from '../Containers/LoginScreen'
import AuthLoginScreen from '../Containers/AuthLoginScreen'
import DashboardScreen from '../Containers/DashboardScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  MapScreen: { screen: MapScreen },
  Incidents: { screen: Incidents },
  AboutScreen: { screen: AboutScreen },
  SettingsScreen: { screen: SettingsScreen },
  RegisterScreen: { screen: RegisterScreen },
  LoginScreen: { screen: LoginScreen },
  AuthLoginScreen: { screen: AuthLoginScreen },
  DashboardScreen: { screen: DashboardScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export const UnauthenticatedNavigator = StackNavigator({
  Launch: {screen: LaunchScreen},
  Login: {screen: LoginScreen},
  Signup: {screen: RegisterScreen}
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'Launch',
  navigationOptions: {
    headerStyle: styles.header
  }
});

export const MainNavigator = StackNavigator({
  Dashboard: { screen: DashboardScreen },
  About: { screen: AboutScreen },
  Settings: { screen: SettingsScreen },
}, {
   // Default config for all screens
   headerMode: 'card',
   initialRouteName: 'Dashboard',
   navigationOptions: {
     headerStyle: styles.header
   }
});

export const ParamedicNavigator = StackNavigator({
  Incidents: { screen: Incidents },
  About: { screen: AboutScreen },
  Settings: { screen: SettingsScreen },
}, {
   // Default config for all screens
   headerMode: 'card',
   initialRouteName: 'Incidents',
   navigationOptions: {
     headerStyle: styles.header
   }
});
export default PrimaryNav
