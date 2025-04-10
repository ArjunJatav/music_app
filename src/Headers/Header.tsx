import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { FontAwesome5, Octicons } from '../Utils/ReactIcons';
import { COLORS } from '../Utils/Colors';
import { HEADER_STYLE } from './HeaderStyle';

interface HeaderWithBackButtonProps {
  title: string;
  filterIcon?: boolean;
  onBackButton: () => void;
  onfilterIconButton?: () => void;
}

export default function HeaderWithBackButton({
  title,
  filterIcon,
  onBackButton,
  onfilterIconButton,
}: HeaderWithBackButtonProps) {
  return (
    <View style={HEADER_STYLE.HEADER_WITH_BACK}>
      <TouchableOpacity
        style={HEADER_STYLE.BACK_BUTTON_CONTAINER}
        onPress={onBackButton}>
        <FontAwesome5 name="arrow-left" size={20} color={COLORS.WHITE_COLOR} />
      </TouchableOpacity>

      <View style={HEADER_STYLE.TITLE_CONTAINER}>
        <Text style={HEADER_STYLE.TITLE}>{title}</Text>
      </View>
      {filterIcon && (
        <TouchableOpacity
          style={HEADER_STYLE.BACK_BUTTON_CONTAINER}
          onPress={onfilterIconButton}>
          <Octicons name="filter" size={20} color={COLORS.WHITE_COLOR} />
        </TouchableOpacity>
      )}
    </View>
  );
}
