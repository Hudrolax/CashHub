import { TouchableOpacity, Image } from "react-native";

export const AddBtn = ({ onPress, isActive=true, style }) => {
  return (
    <TouchableOpacity
      style={{
        ...style,
      }}
      onPress={onPress}
      disabled={!isActive}
    >
      <Image source={require('../../assets/add.png')} style={{ width: 50, height: 50 }}/>
    </TouchableOpacity>
  );
};