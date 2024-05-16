import { Text, View, StyleSheet } from "react-native";

import { formatDate, getDayOfWeek } from "../util";
import { redColor, greenColor } from "../colors";

const DayHeader = ({ date, trzCount, totalAmount }) => {
  const totalAmountColor =
    totalAmount[0] === "-" || (totalAmount[0] === "$" && totalAmount[2] === "-")
      ? redColor
      : greenColor;

  return (
    <View style={styles.container}>
      <View style={styles.dayHeader}>
        {/* left side */}
        <View style={{ flexDirection: "row" }}>
          {/* icon */}
          <View style={styles.headerIcon}>
            <Text>🗓️</Text>
          </View>

          {/* date */}
          <View style={styles.headerDate}>
            <Text style={styles.headerDateText}>{formatDate(date)}</Text>
            <Text style={styles.headerDateText}>{getDayOfWeek(date)}</Text>
          </View>
        </View>

        {/* right side */}
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-start",
            marginRight: 5,
          }}
        >
          {/* Total amount */}
          <View>
            <Text
              style={{
                color: totalAmountColor,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {totalAmount}
            </Text>
          </View>
          {/* transactions count */}
          <View>
            <Text style={{ color: "#fff" }}>{"транзакций: " + trzCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  dayHeader: {
    height: 50,
    width: "98%",
    backgroundColor: "#24262f",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerIcon: { justifyContent: "center", marginLeft: 10 },
  headerDate: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 5,
  },
  headerDateText: {
    color: "#d2d4db",
    fontSize: 16,
  },
});

export { DayHeader };
