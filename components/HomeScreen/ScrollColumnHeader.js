import { StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";

import ElipseItem from "./Elipseitem";
import {
  setEditContentType,
  setWalletsInMainCurrency,
  setIncome,
} from "../actions";
import { walletsInMainCurColor } from "../colors";

export default function ScrollColumnHeader({ navigation }) {
  const dispatch = useDispatch();
  const isIncome = useSelector((state) => state.stateReducer.isIncome);
  const walletsInMainCurrency = useSelector(
    (state) => state.stateReducer.walletsInMainCurrency
  );

  const onChangeIncome = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(setIncome(!isIncome));
  };

  return (
    <View style={styles.container}>
      <ElipseItem
        title={"Счета"}
        itemColor={walletsInMainCurrency ? walletsInMainCurColor : "#f9a60a"}
        onPress={() =>
          dispatch(setWalletsInMainCurrency(!walletsInMainCurrency))
        }
        onLongPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          dispatch(setEditContentType("wallets"));
          navigation.navigate("EditScreen");
        }}
      />
      <ElipseItem
        title={isIncome ? "Доходы" : "Расходы"}
        itemColor={isIncome ? "#02af59" : "#cb1357"}
        onPress={onChangeIncome}
        onLongPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          dispatch(setEditContentType(isIncome ? "income" : "outcome"));
          navigation.navigate("EditScreen");
        }}
      />
      <ElipseItem title={"Дата"} itemColor={"#2f88b6"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    maxHeight: 40,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
