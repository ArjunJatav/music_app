import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LibraryRouteParamList } from './LibraryNavigation';
import LibraryScreen from './LibraryScreen';
import MyMusicScreen from './MyMusicScreen';
import MyDownloadScreen from './MyDownloadScreen';
import PlayListScreen from './PlayListScreen';
import PopularTrendingScreen from '../HomeTabs/PopularTrendingScreen';
import NotificationScreen from '../SettingsTabs/NotificationScreen';


const LibraryStack = createNativeStackNavigator<LibraryRouteParamList>();

export default function LibraryRoute() {
  return (
    
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibraryScreen" component={LibraryScreen} />
      <LibraryStack.Screen name="MyMusicScreen" component={MyMusicScreen} />
      <LibraryStack.Screen name="MyDownloadScreen" component={MyDownloadScreen} />
      <LibraryStack.Screen name="PlayListScreen" component={PlayListScreen} />
      <LibraryStack.Screen name="PopularTrendingScreen" component={PopularTrendingScreen} />
      <LibraryStack.Screen name="NotificationScreen" component={NotificationScreen} />
    
    </LibraryStack.Navigator>
  );
}
