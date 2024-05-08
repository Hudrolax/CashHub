import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "./Header";
import ScrollColumns from "./ScrollColumns";
import ScrollColumnHeader from "./ScrollColumnHeader";
import { isEmpty } from "../util";
import { setActiveTab } from "../actions";
import {
  backendRequest,
  wallets_endpoint,
  exin_items_home_endpoint,
} from "../requests";
import { showAlert } from "../util";

export default function HomeScreen({ navigation, route }) {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.loginReducer.token);
  const pressedWallet1 = useSelector(
    (state) => state.stateReducer.pressedWallet1
  );
  const pressedWallet2 = useSelector(
    (state) => state.stateReducer.pressedWallet2
  );
  const pressedExInItem = useSelector(
    (state) => state.stateReducer.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.stateReducer.pressedDate);
  const editDocId = useSelector((state) => state.stateReducer.editDocId);
  const isIncome = useSelector((state) => state.stateReducer.isIncome);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);

  const [data, setData] = useState({wallets: [], exInItems: []});

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));

      const loadData = async () => {
        try {
          const results = await Promise.all([
            await backendRequest({
              dispatch,
              token,
              endpoint: wallets_endpoint,
              method: "GET",
              throwError: true,
            }),
            await backendRequest({
              dispatch,
              token,
              endpoint: exin_items_home_endpoint,
              method: "GET",
              queryParams: {currency_name: mainCurrency.name, income: isIncome},
              throwError: true,
            }),
          ]);
          setData({
            wallets: results[0],
            exInItems: results[0],
          })
        } catch (e) {
          showAlert("Ошибка", "Возможно нет подключения к интернету...");
        }
      };

      console.log('load data')
      loadData();

      return () => {};
    }, [token])
  );

  useEffect(() => {
    if (
      ((((!isEmpty(pressedWallet1) && !isEmpty(pressedExInItem)) ||
        (!isEmpty(pressedWallet1) && !isEmpty(pressedWallet2))) &&
        !isEmpty(pressedDate)) ||
        editDocId) &&
      navigation
    ) {
      navigation.navigate("AddScreen");
    }
  }, [pressedWallet1, pressedWallet2, pressedExInItem, pressedDate, editDocId]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.5, backgroundColor: "#1f1e1b" }}>
        <Image
          source={require("../../assets/home_background.jpg")}
          style={styles.backgroudImage}
          resizeMode="cover"
        ></Image>
        <Header navigation={navigation} style={{ flex: 1 }} />
        <ScrollColumnHeader navigation={navigation} />
      </View>
      <ScrollColumns navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroudImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
});
