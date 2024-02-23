import {
  TouchableOpacity,
  Image,
} from "react-native";

function AIAddBtn({style, onPress}) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={require('../../assets/brain_btn2.png')}
        style={{ width: 50, height: 50 }}
      />
    </TouchableOpacity>
  );
}

export default AIAddBtn;