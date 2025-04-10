import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "./ReactIcons";
import { COLORS } from "./Colors";

const CheckBox = ({ checked, onPress, size = 20, color = "red" } :any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: size,
        width: size,
        backgroundColor:checked ? COLORS.GREEN_COLOR: COLORS.WHITE_COLOR,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: checked ? COLORS.GREEN_COLOR:COLORS.GRAY,
        borderRadius: 3, // Optional rounded corners
      }}
    >
      {checked && <MaterialIcons name="check" size={size * 0.8} color="white" />}
    </TouchableOpacity>
  );
};

export default CheckBox;
