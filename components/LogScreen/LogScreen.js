import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView, View } from "react-native";
import { groupTransactionsByDay, showAlert } from "../util";

import DayLog from "./DayLog";
import { setActiveTab } from "../actions";
import { backendRequest, wallet_transactions_endpoint } from "../requests";

export default function LogScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));

      const loadData = async () => {
        try {
          const result = await backendRequest({
            dispatch,
            token,
            endpoint: wallet_transactions_endpoint,
            method: "GET",
            queryParams: {currency_name: mainCurrency},
            throwError: true,
          });
          setTransactions(result);
        } catch (e) {
          showAlert("Ошибка", `Не удалось загрузить транзакции: ${e.message}`);
        }
      };

      loadData()

      return () => {};
    }, [token, mainCurrency])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <ScrollView>
        {transactions.map((trzDay) => (
          <DayLog key={trzDay.date} navigation={navigation} trzDay={trzDay} />
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
