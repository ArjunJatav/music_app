import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import UserAuthRoute from '../Screens/UserAuth/UserAuthRoute';
import BottomNav from '../BottomTab/BottomNav';
import DrawerNav from '../BottomTab/DrawerNav';


export default function Route() {
  const StackNav = createNativeStackNavigator();
  return (
    <StackNav.Navigator screenOptions={{headerShown: false}}>
      <StackNav.Screen name="UserAuthRoute" component={UserAuthRoute} />
      <StackNav.Screen name="BottomTab" component={BottomNav} />
      <StackNav.Screen name="DrawerNav" component={DrawerNav} />
    </StackNav.Navigator>
  );
}
