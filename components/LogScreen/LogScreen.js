import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";

import DayLog from "./DayLog";
import { View } from "react-native-animatable";
import { prepareTrzs, groupTransactionsByDay } from "../util";
import { fetchHomeData } from "../dataUpdater";

export default function LogScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const user = useSelector((state) => state.login_screen.user);
  const trzExInItems = useSelector((state) => state.mainState.trzExInItems);
  const wallets = useSelector((state) => state.mainState.wallets);
  const transactions = useSelector((state) => state.mainState.transactions);
  const mainCurrency = useSelector((state) => state.mainState.mainCurrency);
  const [preparedTrzs, setPreparedTrzs] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchHomeData(token, user));

      return () => {};
    }, [dispatch, token]) // зависимости dispatch и token
  );

  useEffect(() => {
    let preparedTrzs = groupTransactionsByDay(
      prepareTrzs(transactions, trzExInItems, wallets)
    );
    preparedTrzs = preparedTrzs.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA - dateB;
    });
    setPreparedTrzs(preparedTrzs);
  }, [transactions, trzExInItems, wallets]);

  return (
    <View style={styles.container}>
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
});
