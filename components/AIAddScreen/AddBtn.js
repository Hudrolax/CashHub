import React from "react";
import { TouchableOpacity, Text } from "react-native";

const AddButton = ({ style, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 150,
        height: 30,
        backgroundColor: disabled ? "grey" : "green",
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      disabled={disabled}
    >
      <Text style={{color: "#fff", fontSize: 18, fontWeight: '600'}}>Добавить</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
