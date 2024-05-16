import React from "react";
import { Modal, View, StyleSheet, Text, ActivityIndicator } from "react-native";

const LoadingOverlay = ({ visible, connectionError }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#B3DFFC" />
        {connectionError ? (
          <Text style={styles.textStyle}>
            Потеряно соединение с сервером. Проверьте работоспособность
            интернета.
          </Text>
        ) : null}
      </View>
    </Modal>
  );
};

const NotModalLoadingOverlay = ({ visible, connectionError }) => {
  return (
    visible && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#B3DFFC" />
        {connectionError && (
          <Text style={styles.textStyle}>
            Потеряно соединение с сервером. Проверьте работоспособность интернета.
          </Text>
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  textStyle: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default LoadingOverlay;
export { NotModalLoadingOverlay }