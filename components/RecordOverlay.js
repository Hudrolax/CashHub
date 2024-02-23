import React from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity, Vibration } from "react-native";
import { stopRecording, isEmpty } from "./util";
import { useDispatch, useSelector } from "react-redux";
import { setRecording, setRecognizedText } from "./actions";

const RecordOverlay = () => {
  const dispatch = useDispatch();
  const recording = useSelector((state) => state.stateReducer.recording);

  const onStopRecording = async () => {
    // Vibration.vibrate(1);
    const result = await stopRecording(dispatch, recording);
    dispatch(setRecognizedText(result))
    dispatch(setRecording(null));
  };

  return (
    <Modal transparent={false} visible={!isEmpty(recording)} animationType="none">
      <View style={styles.overlay}>
        <View/>
        <Text style={{ color: "#fff", fontSize: 26, marginBottom: 60 }}>
          Говорите...
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 75,
            height: 90,
            width: 90,
            backgroundColor: "red",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onStopRecording}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "600" }}>
            Stop
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    backgroundColor: "#000000",
  },
  textStyle: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default RecordOverlay;
