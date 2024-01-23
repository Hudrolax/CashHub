import CircleItem from "./CircleItem";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";

import { redColor, greenColor } from "../colors";
import { formatNumber, calculateTotalAmountExInItem } from "../util";

export default function ExInItems({ navigation }) {
  const _exInItems = useSelector((state) => state.mainState.exInItems);
  const _transactions = useSelector((state) => state.mainState.transactions);
  const isIncome = useSelector((state) => state.stateReducer.isIncome);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const [transactions, setTransactions] = useState([]);
  const [exInItems, setExInItems] = useState([]);

  useEffect(() => {
    setTransactions(
      _transactions.filter((trz) => trz.exInItem && !trz.deleted)
    );
  }, [_transactions]);

  useEffect(() => {
    setExInItems(
      _exInItems.map((item) => {
        const totalMonthAmount = calculateTotalAmountExInItem(
          transactions,
          item.id,
          mainCurrency
        );

        return {
          ...item,
          monthAmount: totalMonthAmount,
        };
      })
    );
  }, [transactions, mainCurrency, _exInItems]);

  return (
    <ScrollView
      style={styles.column}
      contentContainerStyle={styles.columnContent}
    >
      {exInItems.map((item) =>
        isIncome === item.income ? (
          <CircleItem
            key={item.id}
            title={item.name}
            circleColor={isIncome ? greenColor : redColor}
            circleText={item.name[0].toUpperCase()}
            subtitle={formatNumber(item.monthAmount, mainCurrency)}
            // subtitle={item.monthAmount}
            object={item}
            object_type={"exInItem"}
            pressible={true}
          />
        ) : null
      )}
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
