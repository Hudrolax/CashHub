import { StyleSheet, View, Vibration } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ElipseItem from "./Elipseitem";
import { setEditContentType, setWalletsInMainCurrency, setIncome } from "../actions";
import { walletsInMainCurColor } from "../colors";

export default function ScrollColumnHeader({ navigation }) {
  const dispatch = useDispatch();
  const isIncome = useSelector((state) => state.mainState.isIncome);
  const walletsInMainCurrency = useSelector((state) => state.mainState.walletsInMainCurrency);

  const onChangeIncome = () => {
    Vibration.vibrate(2);
    dispatch(setIncome(!isIncome));
  };

  return (
    <View style={styles.container}>
      <ElipseItem
        title={"Счета"}
        itemColor={walletsInMainCurrency ? walletsInMainCurColor : "#f9a60a"}
        onPress={() => dispatch(setWalletsInMainCurrency(!walletsInMainCurrency))}
        onLongPress={() => {
          Vibration.vibrate(2);
          dispatch(setEditContentType("wallets"));
          navigation.navigate("EditScreen");
        }}
      />
      <ElipseItem
        title={isIncome ? "Доходы" : "Расходы"}
        itemColor={isIncome ? "#02af59" : "#cb1357"}
        onPress={onChangeIncome}
        onLongPress={() => {
          Vibration.vibrate(2);
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
    backgroundColor: "#1f1e1b",
    maxHeight: 40,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
