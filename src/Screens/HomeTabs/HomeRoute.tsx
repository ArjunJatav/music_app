import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeRouteParamList } from './HomeNavigation';
import HomeScreen from './HomeScreen';
import PublicPlaylistScreen from './PublicPlaylistScreen';
import PopularTrendingScreen from './PopularTrendingScreen';
import ArtistScreen from './ArtistScreen';
import ArtistDetailsScreen from './ArtistDetailScreen';
import GenreScreen from './GenreScreen';
import NotificationScreen from '../SettingsTabs/NotificationScreen';


const HomeStack = createNativeStackNavigator<HomeRouteParamList>();

export default function HomeRoute() {
  return (
    
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="PublicPlaylistScreen" component={PublicPlaylistScreen} />
      <HomeStack.Screen name="PopularTrendingScreen" component={PopularTrendingScreen} />
      <HomeStack.Screen name="ArtistScreen" component={ArtistScreen} />
      <HomeStack.Screen name="ArtistDetailsScreen" component={ArtistDetailsScreen} />
      <HomeStack.Screen name="GenreScreen" component={GenreScreen} />
      <HomeStack.Screen name="NotificationScreen" component={NotificationScreen} />
  
    </HomeStack.Navigator>
  );
}
