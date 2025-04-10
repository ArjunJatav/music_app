import React from 'react';
import {TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {COLORS} from './Colors'; // Assuming you have a Colors file
import {WINDOW_WIDTH} from './DimensionsUtil';

interface SocialAuthButtonProps {
  title: string;
  icon: any;
  backgroundColor: string;
  textColor?: string;
  onPress: () => void;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  title,
  icon,
  backgroundColor,
  textColor = '#fff',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.text, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    width: WINDOW_WIDTH - 20,
    height: 45,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: COLORS.BORDER_COLOR,
    alignSelf: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialAuthButton;
