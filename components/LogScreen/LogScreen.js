import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";

import DayLog from "./DayLog";
import { View } from "react-native-animatable";
import CurrencySelector from "../HomeScreen/CurrencySelector";
import { prepareTrzs, groupTransactionsByDay } from "../util";
import { fetchHomeData } from "../HomeScreen/actions";

export default function LogScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const exInItems = useSelector((state) => state.mainState.exInItems);
  const wallets = useSelector((state) => state.mainState.wallets);
  const transactions = useSelector((state) => state.mainState.transactions);
  const mainCurrency = useSelector((state) => state.mainState.mainCurrency);

  const preparedTrzs = groupTransactionsByDay(
    prepareTrzs(transactions, exInItems, wallets)
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchHomeData(token));

      return () => {};
    }, [dispatch, token]) // зависимости dispatch и token
  );

  return (
    <View style={styles.container}>
      <CurrencySelector style={styles.currencySelector} />
      <View style={styles.header}></View>
      <ScrollView>
        {preparedTrzs.map((trzDay) => (
          <DayLog
            key={trzDay[0].date}
            dayTransactions={trzDay}
            date={trzDay[0].date}
            mainCurrency={mainCurrency}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181715",
  },
  header: {
    height: 40,
  },
  currencySelector: {
    position: "absolute",
    top: ".5%",
    right: "3%",
    zIndex: 3000,
  },
});
