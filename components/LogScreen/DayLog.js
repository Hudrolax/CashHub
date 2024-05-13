import { View } from "react-native";
import { useSelector } from "react-redux";
import React from "react";
import * as Haptics from "expo-haptics";
import { DayItem, ExchangeDayItem } from "./DayItem";
import { DayHeader } from "./DayHeader";
import { formatNumber, isEmpty } from "../util";

function DayLog({ navigation, trzDay, symbols }) {
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);

  const getAmount = (trz, walletType) =>
    formatNumber(trz[`amount_${walletType}`], mainCurrency);

  const onPress = (trz) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("AddScreen", { trz, symbols });
  };

  return (
    <View>
      <DayHeader
        date={trzDay.date}
        trzCount={trzDay.day_transactions.length}
        totalAmount={formatNumber(trzDay.day_amount, mainCurrency)}
      />
      {trzDay.day_transactions.map((item) => {
        if (isEmpty(item.wallet_to.id)) {
          return (
            <DayItem
              key={item.doc_id}
              exInItem={item.exin_item}
              wallet={item.wallet_from}
              amount={getAmount(item, "from")}
              user={item.user}
              comment={item.comment}
              onPress={() => onPress(item)}
            />
          );
        } else {
          return (
            <ExchangeDayItem
              key={item.doc_id}
              wallet1={item.wallet_from}
              wallet2={item.wallet_to}
              amount1={item.amount_from}
              amount2={item.amount_to}
              user={item.user}
              comment={item.comment}
              onPress={() => onPress(item)}
            />
          );
        }
      })}
    </View>
  );
}

export default DayLog;
