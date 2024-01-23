import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Vibration,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { greenColor, redColor, orangeColor } from "../colors";
import { formatNumber } from "../util";
import { setEditDocId } from "../actions";

const Separator = () => {
  return (
    <View
      style={{
        backgroundColor: "#4b4c4d",
        height: 1,
        width: "100%",
      }}
    />
  );
};

const nameStyle = (my_user, user) => {
  let style = styles.userName;
  if (user.id !== my_user.id) {
    style = { ...style, color: "#ff51ff" };
  }
  return style;
};

const ColorCircle = ({ style, color, text }) => {
  let adFontStyle = {};
  if (Platform.OS !== "ios") {
    adFontStyle = { position: "absolute", top: -3 };
  }

  return (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 60,
        backgroundColor: color,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <Text style={{ fontSize: 16, ...adFontStyle }}>{text}</Text>
    </View>
  );
};

const ExchangeDayItem = ({
  wallet1,
  wallet2,
  amount1,
  amount2,
  user,
  comment,
  doc_id,
  synchronized,
}) => {
  const dispatch = useDispatch();
  const my_user = useSelector((state) => state.login_screen.user);

  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(setEditDocId(doc_id));
  };
  return (
    <View>
      <TouchableHighlight onLongPress={onPress} style={{ paddingVertical: 5 }}>
        <View style={styles.itemContainer}>
          {/* left side */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ColorCircle
              style={{ marginLeft: 10 }}
              color={orangeColor}
              text={"⇄"}
            />
            <View
              style={{
                marginLeft: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.exInItemText}>{"Перевод ("}</Text>
              <Text style={nameStyle(my_user, user)}>{user.name}</Text>
              <Text style={styles.exInItemText}>{")"}</Text>
              {comment ? (
                <Text style={styles.commentText}>{comment}</Text>
              ) : undefined}
            </View>
          </View>
          {/* right side */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Text style={styles.exchangeTrzAmount}>
                {formatNumber(amount1.slice(1), wallet1.currency.name) +
                  " → " +
                  formatNumber(amount2, wallet2.currency.name)}
              </Text>
              <Text style={styles.exchangeTrzWallets}>
                {wallet1.name + " → " + wallet2.name}
              </Text>
            </View>
            {!synchronized && <Text>⏳</Text>}
          </View>
        </View>
      </TouchableHighlight>
      <Separator />
    </View>
  );
};

const DayItem = ({
  exInItem,
  wallet,
  amount,
  user,
  comment,
  doc_id,
  synchronized,
}) => {
  const dispatch = useDispatch();
  const my_user = useSelector((state) => state.login_screen.user);

  const trzColor = () => (exInItem.income ? greenColor : redColor);

  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(setEditDocId(doc_id));
  };

  return (
    <View>
      <TouchableHighlight onLongPress={onPress} style={{ paddingVertical: 5 }}>
        <View style={styles.itemContainer}>
          {/* left side */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ColorCircle style={{ marginLeft: 10 }} color={trzColor()} />
            <View style={{ marginLeft: 5, justifyContent: "center" }}>
              <Text style={styles.exInItemText}>{exInItem.name}</Text>

              {/* wallet and name */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.walletText}>{wallet.name + "("}</Text>
                <Text style={nameStyle(my_user, user)}>{user.name}</Text>
                <Text style={styles.walletText}>)</Text>
              </View>

              {comment ? (
                <Text style={styles.commentText}>{comment}</Text>
              ) : null}
            </View>
          </View>
          {/* right side */}
          <View
            style={{
              justifyContent: "center",
              marginRight: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.transactionAmount, color: trzColor() }}>
              {amount}
            </Text>
            {!synchronized && <Text>⏳</Text>}
          </View>
        </View>
      </TouchableHighlight>
      <Separator />
    </View>
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
    fontSize: 14,
  },
  userName: {
    color: "#b4d4ff",
    fontSize: 12,
  },
  commentText: {
    color: orangeColor,
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 18,
    // fontWeight: "bold",
  },
  exchangeTrzAmount: {
    color: "#fff",
    fontSize: 18,
    // fontWeight: "bold",
  },
  exchangeTrzWallets: {
    color: "#fff",
    fontSize: 12,
  },
});

export { DayItem, ExchangeDayItem };
