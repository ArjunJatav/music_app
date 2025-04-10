import React, { useEffect, useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Route from './src/Navigation/Route';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const StackNav = createNativeStackNavigator();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [isConnected, setIsConnected] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && !alertShown) {
        setAlertShown(true); // Prevent multiple alerts
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [{ text: 'OK', onPress: () => setAlertShown(false) }] // Reset alert after dismiss
        );
      } else if (state.isConnected) {
        setAlertShown(false); // Reset when internet is back
      } //@ts-ignore
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [alertShown]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <NavigationContainer>
        <StackNav.Navigator screenOptions={{ headerShown: false }}>
          <StackNav.Screen name="Route" component={Route} />
        </StackNav.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
