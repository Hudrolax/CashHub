import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import isEmptyObject, {
  formatDate,
  formatDateShort,
  formatNumber,
} from "../util";
import CircleItem from "../HomeScreen/CircleItem";
import { blueColor, greenColor, orangeColor, redColor } from "../colors";
import { fetchRequest } from "./actions";

const DelBtn = ({ navigation, doc_id, style, onDelete }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);

  const onPress = () => {
    Vibration.vibrate(2);
    dispatch(
      fetchRequest(token, null, `/wallet_transactions/${doc_id}`, "DELETE")
    );
    navigation.navigate("Tabs");
    onDelete()
    return true;
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        ...style,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 16 }}>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

const CancelBtn = ({ navigation, style }) => {
  const onCancel = () => {
    Vibration.vibrate(2);
    navigation.navigate("Tabs");
    return true;
  };

  return (
    <View
      style={{ backgroundColor: redColor, width: 100, height: 30, ...style }}
    >
      <TouchableOpacity onPress={onCancel}>
        <Text style={{ color: "white", fontSize: 22, textAlign: "center" }}>
          {"Отмена"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AddHeader({ navigation, trz, onDelete }) {
  const pressedWallet1 = useSelector((state) => state.mainState.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.mainState.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.mainState.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.mainState.pressedDate);
  const _isIncome = useSelector((state) => state.mainState.isIncome);

  const exchangeMode = !isEmptyObject(pressedWallet2) || (trz && trz.wallet2);
  const wallet1 = trz ? trz.wallet1 : pressedWallet1;
  const wallet2 = trz ? trz.wallet2 : pressedWallet2;
  const exInItem = trz ? trz.exInItem : pressedExInItem;
  const isIncome = trz ? trz.amount1[0] !== "-" : _isIncome;
  const date = trz
    ? {
        id: 1,
        text: formatDateShort(new Date(trz.date)),
        title: formatDate(trz.date),
        date: trz.date,
      }
    : pressedDate;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {trz ? <DelBtn navigation={navigation} doc_id={trz.doc_id} style={styles.delBtn} onDelete={onDelete} /> : null}
        <CancelBtn navigation={navigation} style={styles.cancelBtn} />
      </View>

      {exchangeMode ? (
        <View style={styles.confIcons}>
          <CircleItem
            key={2}
            title={formatNumber(wallet1.balance, wallet1.currency.name, true)}
            circleColor={orangeColor}
            circleText={wallet1.currency.name}
            subtitle={wallet1.name}
            object={wallet1}
            object_type={"wallet"}
          />
          <View style={styles.separatorArrows}>
            <Text style={{ color: "#fff", fontSize: 46 }}>→</Text>
          </View>
          <CircleItem
            key={3}
            title={formatNumber(wallet2.balance, wallet2.currency.name, true)}
            circleColor={orangeColor}
            circleText={wallet2.currency.name}
            subtitle={wallet2.name}
            object={wallet2}
            object_type={"wallet"}
          />
        </View>
      ) : (
        <View style={styles.confIcons}>
          <CircleItem
            key={2}
            title={formatNumber(wallet1.balance, wallet1.currency.name, true)}
            circleColor={orangeColor}
            circleText={wallet1.currency.name}
            subtitle={wallet1.name}
            object={wallet1}
            object_type={"wallet"}
          />
          <View style={styles.separator} />
          <CircleItem
            key={3}
            title={""}
            circleColor={isIncome ? greenColor : redColor}
            circleText={exInItem.name[0].toUpperCase()}
            subtitle={exInItem.name}
            object={exInItem}
            object_type={"exInItem"}
          />
          <View style={styles.separator} />
          <CircleItem
            key={4}
            title={""}
            circleColor={blueColor}
            circleText={date.text}
            subtitle={date.title}
            object={date}
            object_type={"date"}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181715",
  },
  header: {
    height: 50,
  },
  delBtn: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  cancelBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  confIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    width: "10%",
    backgroundColor: "white",
    marginHorizontal: "2%",
  },
  separatorArrows: {
    width: "10%",
    marginHorizontal: "2%",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 10,
  },
});
