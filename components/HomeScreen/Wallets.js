import CircleItem from "./CircleItem";
import { useSelector } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";

import { orangeColor } from "../colors";
import { formatNumber } from "../util";

export default function Wallets() {
  const wallets = useSelector((state) => state.mainState.wallets);

  return (
    <ScrollView
      style={styles.column}
      contentContainerStyle={styles.columnContent}
    >
      {wallets.map((item) => (
        <CircleItem
          key={item.id}
          title={item.name}
          circleColor={orangeColor}
          circleText={item.currency.name}
          subtitle={formatNumber(item.balance, item.currency.name, true)}
          object={item}
          object_type={"wallet"}
          pressible={true}
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
