import CircleItem from "./CircleItem";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { redColor, greenColor } from "../colors";
import { formatNumber } from "../util";
import { backendRequest, exin_items_home_endpoint } from "../requests";

export default function ExInItems({ navigation, onPress }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const isIncome = useSelector((state) => state.stateReducer.isIncome);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const [exInItems, setExInItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const results = await Promise.all([
            backendRequest({
              dispatch,
              token,
              endpoint: exin_items_home_endpoint,
              method: "GET",
              queryParams: {currency_name: mainCurrency, income: isIncome},
              throwError: true,
            })
          ]);
          setExInItems(results[0]);
        } catch (e) {
          console.error(`Не удалось загрузить ExInItems: ${e.message}`);
        }
      };

      loadData();

      return () => {};
    }, [isIncome, mainCurrency])
  );

  return (
    <ScrollView
      style={styles.column}
      contentContainerStyle={styles.columnContent}
    >
      {exInItems.map((item) =>
        (
          <CircleItem
            key={item.id}
            title={item.name}
            circleColor={isIncome ? greenColor : redColor}
            circleText={item.name[0].toUpperCase()}
            subtitle={formatNumber(item.amount, mainCurrency)}
            object={item}
            onPress={onPress}
            btnType="exInItem"
          />
        )
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
