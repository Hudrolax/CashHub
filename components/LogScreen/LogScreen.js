import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView, View } from "react-native";
import { groupTransactionsByDay } from "../util";

import DayLog from "./DayLog";
import { setActiveTab } from "../actions";

export default function LogScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.mainState.transactions);
  const [preparedTrzs, setPreparedTrzs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));

      return () => {};
    }, [])
  );

  useEffect(() => {
    const preparedTrzs = groupTransactionsByDay(
      transactions
        .filter((trz) => !trz.deleted)
        .sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateA - dateB;
        })
    );
    setPreparedTrzs(preparedTrzs);
  }, [transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}/>
      <ScrollView>
        {preparedTrzs.map((trzDay) => (
          <DayLog key={trzDay[0].date} dayTransactions={trzDay} />
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
