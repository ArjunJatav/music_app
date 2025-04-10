import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../Utils/Colors';
import {WINDOW_WIDTH} from '../Utils/DimensionsUtil';
import {IMAGES_ASSETS} from '../Utils/Images';
import { Fontisto } from '../Utils/ReactIcons';

interface HeaderWithBackButtonProps {
  title: string;
  onNotificationClick: () => void;
}

export default function HomeHeader({
  title,
  onNotificationClick,
}: HeaderWithBackButtonProps) {
  return (
    <View
      style={{
        height: 60,
        backgroundColor: COLORS.BLACK_COLOR,
        flexDirection: 'row',
        paddingHorizontal: 15,
      }}>

      <View
        style={{
          width: WINDOW_WIDTH - 100,
          justifyContent: "flex-start",
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={IMAGES_ASSETS.LOGO_IMAGE}
          style={{height: 25, width: 25, borderRadius: 5, marginRight: 5}}
        />
        <Text style={{color: COLORS.WHITE_COLOR, fontSize: 18, fontWeight:"600"}}>{title}</Text>
      </View>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: 70,
          flexDirection: 'row',
        }}>
        <Fontisto
          name={'bell'}
          size={25}
          color={COLORS.WHITE_COLOR}
          style={{height: 25, width: 25, borderRadius: 5, marginRight: 5}}
          onPress={onNotificationClick}
          activeOpacity={0.8}
        />
      </View>
    </View>
  );
}
