import { View } from "react-native";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { DayItem, ExchangeDayItem } from "./DayItem";
import { DayHeader } from "./DayHeader";
import { calculateTotalAmount, formatNumber, isEmpty } from "../util";

function DayLog({ dayTransactions }) {
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const [totalAmount, setTotalAmount] = useState([]);

  useEffect(() => {
    setTotalAmount(calculateTotalAmount(dayTransactions, mainCurrency));
  }, [dayTransactions, mainCurrency]);

  const getAmount = (trz, walletNum) =>
    formatNumber(trz[`amount${mainCurrency}${walletNum}`], mainCurrency);

  return (
    <View>
      <DayHeader
        date={dayTransactions[0].date}
        trzCount={dayTransactions.length}
        totalAmount={formatNumber(totalAmount, mainCurrency)}
      />
      {dayTransactions.map((item) => {
        if (isEmpty(item.wallet2)) {
          return (
            <DayItem
              key={item.doc_id}
              exInItem={item.exInItem}
              wallet={item.wallet1}
              amount={getAmount(item, 1)}
              user={item.user}
              comment={item.comment}
              doc_id={item.doc_id}
              synchronized={!item.modified}
            />
          );
        } else {
          return (
            <ExchangeDayItem
              key={item.doc_id}
              wallet1={item.wallet1}
              wallet2={item.wallet2}
              amount1={item.amount1}
              amount2={item.amount2}
              user={item.user}
              comment={item.comment}
              doc_id={item.doc_id}
              synchronized={!item.modified}
            />
          );
        }
      })}
    </View>
  );
}

export default DayLog;
