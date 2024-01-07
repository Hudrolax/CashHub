import {
  StyleSheet,
  View,
  Text,
  Vibration,
  TouchableHighlight,
} from "react-native";
import { useDispatch } from "react-redux";

import { setEditItem } from "../actions";

export default function ListItem({navigation, item }) {
  const dispatch = useDispatch();

  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(setEditItem(item))
    navigation.navigate("EditItem");
  };

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.container}>
        <Text style={{ color: "#fff", fontSize: 16, marginLeft: 10 }}>
          {item.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
