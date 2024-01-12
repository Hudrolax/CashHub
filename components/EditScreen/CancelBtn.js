import { Text, TouchableOpacity } from "react-native";

import { redColor } from "../colors";

export const CancelBtn = ({ text, onPress, style, isActive=true }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: redColor,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 40,
        ...style,
      }}
      onPress={onPress}
      disabled={!isActive}
    >
      <Text style={{ color: "#fff", fontSize: 18 }}>{text}</Text>
    </TouchableOpacity>
  );
};