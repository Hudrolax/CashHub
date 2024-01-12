import { Text, TouchableOpacity } from "react-native";

import { greenColor } from "../colors";

export const OkBtn = ({ text, onPress, isActive, style }) => {
  const bgColor = isActive ? greenColor : "grey";
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
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
