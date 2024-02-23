import {
  StyleSheet,
  View,
  Text,
  Vibration,
  TouchableHighlight,
} from "react-native";
import { useDispatch } from "react-redux";

import { setEditItem } from "../actions";
import { formatNumber } from "../util";

export default function ListItem({ navigation, item }) {
  const dispatch = useDispatch();

  const onPress = () => {
    // Vibration.vibrate(1);
    dispatch(setEditItem(item));
    navigation.navigate("EditItem");
  };

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.container}>
        <Text style={{ color: "#fff", fontSize: 16, marginLeft: 10 }}>
          {item.name}
        </Text>
        {item.balance ? (
          <Text style={{ color: "#fff", fontSize: 16, marginRight: 10 }}>
            {formatNumber(item.balance, item.currency.name)}
          </Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
