import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { WINDOW_WIDTH } from "./DimensionsUtil";
import { COLORS } from "./Colors";

const CommonButton = ({ title, onPress, style, textStyle } :any) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    backgroundColor: COLORS.PINK_COLOR, 
    width:WINDOW_WIDTH -20,
    height: 45,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CommonButton;
