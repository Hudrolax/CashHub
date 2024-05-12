import { useSelector } from "react-redux";
import React from "react";
import CircleItem from "./CircleItem";
import { StyleSheet, ScrollView } from "react-native";
import { orangeColor, walletsInMainCurColor } from "../colors";
import { formatNumber } from "../util";
import { getRate } from "../util";

export default function Wallets({ navigation, data, onPress}) {
  const {wallets, symbols, currency} = data
  const _wallets = wallets.map(item => ({...item, currency: currency.find(cur => cur.id === item.currency_id)}))
  const walletsInMainCurrency = useSelector(
    (state) => state.stateReducer.walletsInMainCurrency
  );
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);


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
      {_wallets.map((item) => (
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
          onPress={onPress}
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
