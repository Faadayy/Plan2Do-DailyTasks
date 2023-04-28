import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/auth/login";
import Register from "../screens/auth/register";
import Splash from "../screens/splash/splash";
import DashBoard from "../screens/dashboard/home";
import Profile from "../screens/profile/index";
import PrivacyPolicy from "../screens/others/privacyPolicy";


export default function Navigation() {

  return (
    <NavigationContainer    >
      <RootNavigator />
    </NavigationContainer>
  );
}


const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="DashBoard" component={DashBoard} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
}
