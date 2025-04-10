import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WINDOW_WIDTH } from "./DimensionsUtil";
import { COLORS } from "./Colors";

const DividerWithText = ({ text = "Or", color =COLORS.BORDER_COLOR, lineWidth = "40%" } :any) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: color, width: lineWidth }]} />
      <Text style={[styles.text, { color }]}>{text}</Text>
      <View style={[styles.line, { backgroundColor: color, width: lineWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: WINDOW_WIDTH - 20,
    marginVertical: 10,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor:COLORS.BORDER_COLOR,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DividerWithText;
