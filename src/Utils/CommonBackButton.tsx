import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from './Colors';
import { Ionicons } from './ReactIcons';
import { WINDOW_WIDTH } from './DimensionsUtil';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
  size?: number;
  iconName?: string; // New: Allows custom icon
}

const CommonBackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  color = COLORS.BLACK_COLOR, // Default color
  size = 24, // Default size
  iconName = Platform.OS  ==="ios" ? "chevron-back" :'arrow-back', // Default icon
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[styles.button, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Improves touch area
    >
      <Ionicons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width:WINDOW_WIDTH,
    alignItems: "flex-start",
  },
});

export default CommonBackButton;
