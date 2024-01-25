import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const LittleBackButton = ({ style, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.button, ...style }}>
      <Svg height="24" width="24" viewBox="0 0 24 24">
        <Path
          d="M19 12H5M12 19l-7-7 7-7"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: 40,
    width: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
});

export default LittleBackButton;