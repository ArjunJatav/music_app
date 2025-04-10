import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { UserAuthRouteParamList } from "./UserAuthNavigation";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import ForgotPassword from "./ForgotPassward";
import SignUpScreen from "./SignUpScreen";
import OtpVerificationScreen from "./OtpScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";

const SplashStack = createNativeStackNavigator<UserAuthRouteParamList>();

export default function UserAuthRoute() {
  return (
    <SplashStack.Navigator screenOptions={{ headerShown: false }}>
      <SplashStack.Screen name="SplashScreen" component={SplashScreen} />
      <SplashStack.Screen name="LoginScreen" component={LoginScreen} />
      <SplashStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <SplashStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <SplashStack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      <SplashStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </SplashStack.Navigator>
  );
}
