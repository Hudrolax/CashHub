import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

const ArchiveButton = ({ style, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.button, ...style }}>
      <Svg height="24" width="24" viewBox="0 0 24 24">
        <Path
          d="M21,3H3C2.448,3,2,3.448,2,4v4c0,0.552,0.448,1,1,1h3v9c0,0.552,0.448,1,1,1h10c0.552,0,1-0.448,1-1v-9h3
          c0.552,0,1-0.448,1-1V4C22,3.448,21.552,3,21,3z M14,14h-4v-2h4V14z"
          fill="#fff"
        />
        <Rect x="7" y="7" width="10" height="2" fill="#fff" />
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

export default ArchiveButton;
