import { TouchableOpacity, Text, View } from "react-native";

export const DeleteBtn = ({ onPress, style, isActive = true }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!isActive}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "red",
          justifyContent: "center",
          alignItems: "center",
          width: 110,
          height: 30,
          ...style,
        }}
      >
        <Text style={{ fontSize: 18, color: "red" }}>❌ Удалить</Text>
      </View>
    </TouchableOpacity>
  );
};
