import {
  StyleSheet,
  Vibration,
  BackHandler,
  View,
  Text,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setEditItem } from "../actions";
import { WalletEditItem } from "./WalletEditItem";
import { ExInItemEdit } from "./ExInItemEdit";
import { CancelBtn } from "./CancelBtn";
import { DeleteBtn } from "./DeleteBtn";
import { greenColor, orangeColor, redColor } from "../colors";
import { fetchHomeData, dispatchedFetchRequest } from "../dataUpdater";

export default function EditItemScreen({ navigation }) {
  const dispatch = useDispatch();
  const editItem = useSelector((state) => state.stateReducer.editItem);
  const currencies = useSelector((state) => state.mainState.currencies);
  const token = useSelector((state) => state.login_screen.token);
  const user = useSelector((state) => state.login_screen.user);

  const itemText = editItem && editItem.balance ? "счет" : "статью";

  const getHeader = () => {
    const headerTextPart1 = editItem.id ? "Редактирование " : "Создание ";
    return headerTextPart1 + (editItem.balance ? "счета" : "статьи");
  };

  const onCancel = () => {
    // Vibration.vibrate(1);
    navigation.navigate("EditScreen");
    return true;
  };

  const deleteAndReturn = () => {
    if (editItem.balance) {
      dispatch(dispatchedFetchRequest(token, null, `/wallets/${editItem.id}`, "DELETE"));
    } else {
      dispatch(dispatchedFetchRequest(token, null, `/exin_items/${editItem.id}`, "DELETE"));
    }
    dispatch(fetchHomeData(token, user));
    navigation.navigate("EditScreen");
  };

  const onDelete = () => {
    // Vibration.vibrate(1);

    Alert.alert(
      "Подтверждение действия", // Заголовок
      `Вы уверены, что хотите удалить ${itemText}?`, // Сообщение или вопрос
      [
        {
          text: "Отмена",
          onPress: () => Vibration.vibrate(2),
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

  const onOk = (data) => {
    // Vibration.vibrate(1);
    if (data.balance) {
      const currency = currencies.find((c) => c.name === data.currencyName);
      const payload = {
        name: data.name,
        currency_id: currency.id,
      };
      if (data.id) {
        dispatch(fetchRequest(token, payload, `/wallets/${data.id}`, "PUT"));
      } else {
        dispatch(fetchRequest(token, payload, "/wallets/", "POST"));
      }
    } else {
      const payload = {
        name: data.name,
        income: data.income,
      };
      if (data.id) {
        dispatch(fetchRequest(token, payload, `/exin_items/${data.id}`, "PUT"));
      } else {
        dispatch(fetchRequest(token, payload, "/exin_items/", "POST"));
      }
    }
    navigation.navigate("EditScreen");
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onCancel
    );

    return () => {
      backHandler.remove();
      dispatch(setEditItem(undefined));
    };
  }, []);

  const bgColor = editItem.balance
    ? orangeColor
    : editItem.income
    ? greenColor
    : redColor;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.header, backgroundColor: bgColor }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20 }}>
          {getHeader()}
        </Text>
        <DeleteBtn onPress={onDelete} />
      </View>
      {editItem.balance != undefined ? (
        <WalletEditItem wallet={editItem} style={{ flex: 1 }} onOk={onOk} />
      ) : (
        <ExInItemEdit exInItem={editItem} style={{ flex: 1 }} onOk={onOk} />
      )}

      <View style={styles.footer}>
        <CancelBtn text={"Назад"} onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  header: {
    height: 40,
    backgroundColor: orangeColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footer: {
    backgroundColor: "#242221",
    height: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
