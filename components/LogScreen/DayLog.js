import { View } from "react-native";

import { DayItem, ExchangeDayItem } from "./DayItem";
import { DayHeader } from "./DayHeader";
import { calculateTotalAmount, formatNumber, isEmpty } from "../util";

export default function DayLog({ dayTransactions, date, mainCurrency }) {
  const totalAmount = calculateTotalAmount(dayTransactions, mainCurrency);

  const getAmount = (trz, walletNum) =>
    formatNumber(trz[`amount${mainCurrency}${walletNum}`], mainCurrency);

  return (
    <View>
      <DayHeader
        date={date}
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
              userName={item.user_name}
              comment={item.comment}
              doc_id={item.doc_id}
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
              userName={item.user_name}
              comment={item.comment}
              doc_id={item.doc_id}
            />
          );
        }
      })}
    </View>
  );
}
