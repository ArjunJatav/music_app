import React from "react";
import { View, Modal, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS } from "../Utils/Colors";

const CustomLoadingModal = ({ isVisible, message = "Loading..." }:any) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={COLORS.PINK_COLOR} />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.PINK_COLOR,
    fontSize: 16,
  },
});

export default CustomLoadingModal;
