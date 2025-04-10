export type UserAuthRouteParamList = {
    SplashScreen: undefined;
    LoginScreen: undefined; 
    ForgotPassword: undefined; 
    SignUpScreen: undefined; 
    OtpVerificationScreen: { email: string , isScreenFrom: string };
    ResetPasswordScreen: { email: string};
    // BottomTab: undefined; 
    // HomeRoute: undefined; 
  };