import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SearchScreen from './SearchScreen';
import { SearchRouteParamList } from './Searchnavigation';
import PopularTrendingScreen from '../HomeTabs/PopularTrendingScreen';
import ArtistDetailsScreen from '../HomeTabs/ArtistDetailScreen';


const SearchStack = createNativeStackNavigator<SearchRouteParamList>();

export default function SearchRoute() {
  return (
    
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen name="PopularTrendingScreen" component={PopularTrendingScreen} />
      <SearchStack.Screen name="ArtistDetailsScreen" component={ArtistDetailsScreen} />

    </SearchStack.Navigator>
  );
}
