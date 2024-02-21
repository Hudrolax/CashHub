import { useSelector } from "react-redux";

import CircleItem from "./CircleItem";
import { StyleSheet, ScrollView } from "react-native";

import { orangeColor, walletsInMainCurColor } from "../colors";
import { formatNumber } from "../util";
import { getRate } from "../util";

export default function Wallets({ navigation }) {
  const wallets = useSelector((state) => state.mainState.wallets);
  const walletsInMainCurrency = useSelector(
    (state) => state.stateReducer.walletsInMainCurrency
  );
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const symbols = useSelector((state) => state.mainState.symbols);

  const calculateBalance = (item) => {
    if (walletsInMainCurrency) {
      const rate = getRate(item.currency.name, mainCurrency, symbols);
      const balance = item.balance * rate;
      return formatNumber(balance, mainCurrency);
    } else {
      return formatNumber(item.balance, item.currency.name);
    }
  };

  return (
    <ScrollView
      style={styles.column}
      contentContainerStyle={styles.columnContent}
    >
      {wallets.map((item) => (
        <CircleItem
          key={item.id}
          title={item.name}
          circleColor={item.color ? item.color : orangeColor}
          circleText={item.currency.name}
          subtitle={calculateBalance(item)}
          subtitleColor={
            walletsInMainCurrency && item.currency.name !== mainCurrency
              ? walletsInMainCurColor
              : undefined
          }
          object={item}
          object_type={"wallet"}
          pressible={true}
        />
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  columnContent: {
    alignItems: "center",
  },
});
