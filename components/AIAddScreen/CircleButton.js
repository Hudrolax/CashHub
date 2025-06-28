import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { orangeColor } from "../colors";

const MicrophoneIcon = () => (
  <Svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 11C19 14.866 15.866 18 12 18V18C8.13401 18 5 14.866 5 11M12 22.0001V18M12 18H15.536M12 18H8.464"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function CircleButton({ onPress, recording }) {
  const buttonStyle = () => ({
    ...styles.button,
    // backgroundColor: recording ? "red" : "#76d1ff",
    backgroundColor: recording ? "red" : orangeColor,
  });
  return (
    <TouchableOpacity style={buttonStyle()} onPress={onPress}>
      {recording ? (
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Stop
        </Text>
      ) : (
        <MicrophoneIcon />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#76d1ff",
    height: 80,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});

export default CircleButton;
