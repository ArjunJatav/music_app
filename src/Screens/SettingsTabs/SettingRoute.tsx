import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SettingScreen from './SettingScreen';
import { SettingRouteParamList } from './SettingNavigation';
import MyProfileScreen from './MyProfileScreen';
import ChangePasswordScreen from './ChangePassword';
import NotificationScreen from './NotificationScreen';
import AboutScreen from './AboutScreen';
import HelpAndSupportScreen from './HelpAndSupport';


const SearchStack = createNativeStackNavigator<SettingRouteParamList>();

export default function SearchRoute() {
  return (
    
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SettingScreen" component={SettingScreen} />
      <SearchStack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      <SearchStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <SearchStack.Screen name="NotificationScreen" component={NotificationScreen} />
      <SearchStack.Screen name="AboutScreen" component={AboutScreen} />
      <SearchStack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} />
    
    </SearchStack.Navigator>
  );
}
