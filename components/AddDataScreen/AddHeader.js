import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";

import { setTransactions } from "../actions";
import { storeData } from "../data";
import {
  isEmpty,
  formatDate,
  formatDateShort,
  formatNumber,
} from "../util";
import CircleItem from "../HomeScreen/CircleItem";
import { blueColor, greenColor, orangeColor, redColor } from "../colors";

const DelBtn = ({ navigation, doc_id, style, onDelete }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.mainState.transactions);

  const deleteAndReturn = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const _trzs = transactions.map((trz) => trz.doc_id === doc_id ? {...trz, deleted: true} : trz)
    storeData("transactions", _trzs)
    dispatch(setTransactions(_trzs))
    
    navigation.navigate("Tabs");
    onDelete();
  };

  const onPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    Alert.alert(
      "Подтверждение действия", // Заголовок
      "Вы уверены, что хотите удалить транзакцию?", // Сообщение или вопрос
      [
        {
          text: "Отмена",
          onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: deleteAndReturn,
        },
      ],
      { cancelable: false } // Пользователь должен явно нажать на одну из кнопок
    );

    return true;
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 110,
        height: 30,
        ...style,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 18, color: "red" }}>❌ Удалить</Text>
      </TouchableOpacity>
    </View>
  );
};

const CancelBtn = ({ navigation, style }) => {
  const onCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
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

export default function AddHeader({ navigation, trz, pressedBtns, onDelete }) {
  const _isIncome = useSelector((state) => state.stateReducer.isIncome);

  const exchangeMode = !isEmpty(pressedWallet2) || (trz && !isEmpty(trz.wallet_to.id));
  const wallet1 = trz ? trz.wallet_from : pressedWallet1;
  const wallet2 = trz ? trz.wallet_to : pressedWallet2;
  const exInItem = trz ? trz.exin_item : pressedExInItem;
  const isIncome = trz ? trz.amount_from >= 0 : _isIncome;
  const date = trz
    ? {
        id: 1,
        text: formatDateShort(new Date(trz.date)),
        title: formatDate(trz.date),
        date: trz.date,
      }
    : pressedDate;
  
  if (isEmpty(wallet1)) return null
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {trz ? (
          <DelBtn
            navigation={navigation}
            doc_id={trz.doc_id}
            style={styles.delBtn}
            onDelete={onDelete}
          />
        ) : null}
        <CancelBtn navigation={navigation} style={styles.cancelBtn} />
      </View>

      {exchangeMode ? (
        <View style={styles.confIcons}>
          <CircleItem
            key={2}
            title={formatNumber(wallet1.balance, wallet1.currency.name)}
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
            title={formatNumber(wallet2.balance, wallet2.currency.name)}
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
            title={formatNumber(wallet1.balance, wallet1.currency.name)}
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
