import React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Line } from "react-native-svg";

const CrossButton = ({ style, onPress, color="black", size=40 }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: size, height: size, ...style }}>
      <Svg height="100%" width="100%" viewBox="0 0 50 50">
        <Line x1="10" y1="10" x2="40" y2="40" stroke={color} strokeWidth="2" />
        <Line x1="40" y1="10" x2="10" y2="40" stroke={color} strokeWidth="2" />
      </Svg>
    </TouchableOpacity>
  );
};

export default CrossButton;
