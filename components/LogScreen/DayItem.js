import { Text, View, StyleSheet, TouchableHighlight, Vibration } from "react-native";
import { useDispatch } from "react-redux";

import { greenColor, redColor, orangeColor } from "../colors";
import { formatNumber } from "../util";
import { setEditDocId } from "../actions";

const ColorCircle = ({ style, color, text }) => {
  return (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 60,
        backgroundColor: color,
        ...style,
      }}
    >
      <Text
        style={{ fontSize: 20, position: "absolute", zIndex: 10, top: -5.5 }}
      >
        {text}
      </Text>
    </View>
  );
};

const ExchangeDayItem = ({
  wallet1,
  wallet2,
  amount1,
  amount2,
  userName,
  comment,
  doc_id,
}) => {
  const dispatch = useDispatch();
  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(setEditDocId(doc_id))
  };

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.itemContainer}>
        {/* left side */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ColorCircle
            style={{ marginLeft: 10 }}
            color={orangeColor}
            text={"⇄"}
          />
          <View style={{ marginLeft: 5 }}>
            <Text style={styles.exInItemText}>{`Перевод (${userName})`}</Text>
            {comment ? (
              <Text style={styles.commentText}>{comment}</Text>
            ) : undefined}
          </View>
        </View>
        {/* right side */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={styles.exchangeTrzAmount}>
            {formatNumber(amount1.slice(1), wallet1.currency.name, true) +
              " ⇄ " +
              formatNumber(amount2, wallet2.currency.name, true)}
          </Text>
          <Text style={styles.exchangeTrzWallets}>
            {wallet1.name + " ⇄ " + wallet2.name}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const DayItem = ({ exInItem, wallet, amount, userName, comment, doc_id }) => {
  const dispatch = useDispatch();
  const trzColor = exInItem.income ? greenColor : redColor;

  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(setEditDocId(doc_id))
  };

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.itemContainer}>
        {/* left side */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ColorCircle style={{ marginLeft: 10 }} color={trzColor} />
          <View style={{ marginLeft: 5, justifyContent: "center" }}>
            <Text style={styles.exInItemText}>{exInItem.name}</Text>
            <Text style={styles.walletText}>
              {wallet.name + ` (${userName})`}
            </Text>
            {comment ? (
              <Text style={styles.commentText}>{comment}</Text>
            ) : undefined}
          </View>
        </View>
        {/* right side */}
        <View style={{ justifyContent: "center", marginRight: 10 }}>
          <Text style={{...styles.transactionAmount, color: trzColor}}>{amount}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exInItemText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  walletText: {
    color: "#fff",
    fontSize: 12,
  },
  commentText: {
    color: "grey",
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exchangeTrzAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  exchangeTrzWallets: {
    color: "#fff",
    fontSize: 12,
  },
});

export { DayItem, ExchangeDayItem };