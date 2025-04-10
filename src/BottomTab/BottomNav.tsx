import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import HomeRoute from '../Screens/HomeTabs/HomeRoute';
import LibraryRoute from '../Screens/LibraryTabs/LibraryRoute';
import SearchRoute from '../Screens/SearchTabs/SearchRoute';
import SettingRoute from '../Screens/SettingsTabs/SettingRoute';
import {FontAwesome} from '../Utils/ReactIcons';
import {COLORS} from '../Utils/Colors';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {WINDOW_WIDTH} from '../Utils/DimensionsUtil';
import {useSelector} from 'react-redux';
import {RootState} from '../Redux/Store';
import MusicPlayModal from '../Modals/MusicPlayModal';
const TAB_BAR_HEIGHT = Platform.OS==="android" ? 60:85; 
const SCREEN_WIDTH = WINDOW_WIDTH;
export default function BottomNav() {
  const Tab = createBottomTabNavigator();
  const MUSIC_TRACKER = useSelector(
    (state: RootState) => state.musicTracker.MUSIC_TRACKER,
  );


  return (
    <View style={styles.container}>
      {MUSIC_TRACKER  && (
        <View style={styles.musicPlayerContainer}>
          <MusicPlayModal />
        </View>
      )}

      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Library') {
              iconName = focused ? 'folder-open' : 'folder-open';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'gear' : 'gear';
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.PINK_COLOR,
          tabBarInactiveTintColor: COLORS.WHITE_COLOR,
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: COLORS.BLACK_COLOR,
            borderTopWidth: 0,
            height: TAB_BAR_HEIGHT,
          },
        })}>
        <Tab.Screen
          name="Home"
          component={HomeRoute}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Library"
          component={LibraryRoute}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Search"
          component={SearchRoute}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Settings"
          component={SettingRoute}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
}

// Helper Function to Control Tab Bar Visibility
function getTabBarVisibility(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName === 'MyProfileScreen' ||
    routeName === 'ChangePasswordScreen' ||
    routeName === 'AboutScreen' ||
    routeName === 'HelpAndSupportScreen' ||
    routeName === 'PublicPlaylistScreen' ||
    routeName === 'PopularTrendingScreen' ||
    routeName === 'MyDownloadScreen' ||
    routeName === 'PlayListScreen' ||
    routeName === 'MyMusicScreen' ||
    routeName === 'ArtistScreen' ||
    routeName === 'ArtistDetailsScreen' ||
    routeName === 'GenreScreen' ||
    routeName === 'NotificationScreen'
  ) {
    return 'none'; // Hide tab bar
  }
  return 'flex'; // Show tab bar
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    // backgroundColor:"red"
  },
  musicPlayerContainer: {
    position: 'absolute',
    // bottom: TAB_BAR_HEIGHT, // Placed just above the bottom navigation
    width: SCREEN_WIDTH,
    backgroundColor: COLORS.BLACK_COLOR, // Background color for visibility
    zIndex: 10, // Ensure it's above the tab navigator
  },
});
