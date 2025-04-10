import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {UserAuthRouteParamList} from './UserAuthNavigation';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {IMAGES_ASSETS} from '../../Utils/Images';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import AsyncStorageService from '../../Utils/AsyncStorageService';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../Redux/AuthReducer';

export default function SplashScreen() {
  const navigation = useAppNavigation<UserAuthRouteParamList>();
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const USER_AUTH_TOKEN = await AsyncStorageService.getItem<string>("USER_AUTH_TOKEN");
        if (USER_AUTH_TOKEN) {
          dispatch(setAuthToken(USER_AUTH_TOKEN));
           //@ts-ignore
          navigation.navigate("BottomTab", { screen: "HomeRoute" });
        } else {
          navigation.navigate("LoginScreen");
        }

      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    const timeout = setTimeout(fetchData, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);



  

  return (
    <View
      style={{
        height: WINDOW_HEIGHT,
        width: WINDOW_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}>
        <Image
          source={IMAGES_ASSETS.SPLASH_BG}
          style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}
        />
      </View>
    </View>
  );
}
