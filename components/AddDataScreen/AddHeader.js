import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";

import {
  isEmpty,
  formatDate,
  formatDateShort,
  formatNumber,
  showAlert,
} from "../util";
import CircleItem from "../HomeScreen/CircleItem";
import { blueColor, greenColor, orangeColor, redColor } from "../colors";
import {
  backendRequest,
  wallet_transactions_endpoint,
} from "../requests";

const DelBtn = ({ navigation, doc_id, style }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);

  const deleteAndReturn = async () => {
    try {
      await backendRequest({
        dispatch,
        token,
        endpoint: wallet_transactions_endpoint + `/${doc_id}`,
        method: "DELETE",
        throwError: true,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      showAlert(
        "Ошибка",
        "Не удалось удалить транзакцию. Возможно нет интернета."
      );
    }
    navigation.goBack();
  };

  const onPress = () => {
    Alert.alert(
      "Подтверждение действия", // Заголовок
      "Вы уверены, что хотите удалить транзакцию?", // Сообщение или вопрос
      [
        {
          text: "Отмена",
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
    navigation.goBack();
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

export default function AddHeader({
  navigation,
  trz,
  pressedWallets,
  pressedExInItem,
  pressedDate,
}) {
  const _isIncome = useSelector((state) => state.stateReducer.isIncome);

  const exchangeMode =
    (pressedWallets && pressedWallets.length > 1) ||
    (trz && !isEmpty(trz.wallet_to.id));
  const wallet1 = trz ? trz.wallet_from : pressedWallets[0]
  const wallet2 = trz ? trz.wallet_to : pressedWallets.length > 1 && pressedWallets[1]
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {trz ? (
          <DelBtn
            navigation={navigation}
            doc_id={trz.doc_id}
            style={styles.delBtn}
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
            onPress={() => null}
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
            onPress={() => null}
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
            onPress={() => null}
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
            onPress={() => null}
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
            onPress={() => null}
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
    borderRadius: 3,
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
