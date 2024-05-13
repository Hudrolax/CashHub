import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import { setPressWallets, setPressExInItem, setPressDate, resetAllPressStates } from "../actions";
import { isEmpty } from "../util";

import Wallets from "./Wallets";
import ExInItems from "./ExInItems";
import Dates from "./Dates";

export default function ScrollColumns({ navigation, data }) {
  const dispatch = useDispatch();
  const pressedWallets = useSelector(
    (state) => state.stateReducer.pressedWallets
  );
  const pressedExInItem = useSelector(
    (state) => state.stateReducer.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.stateReducer.pressedDate);

  const onPressWallet = (pressedItem) => {
    const _pressedItem = {...pressedItem, currency: data.currency.find(cur => cur.id === pressedItem.currency_id)}

    let _pressedWallets = pressedWallets.filter((item) => item.id !== _pressedItem.id);
    if (_pressedWallets.length < pressedWallets.length) {
      dispatch(setPressWallets(_pressedWallets));
    } else if (
      (_pressedWallets.length === 1 && !pressedExInItem) ||
      _pressedWallets.length === 0
    ) {
      _pressedWallets.push(_pressedItem);
      dispatch(setPressWallets(_pressedWallets));
    } else if (
      _pressedWallets.length === 2 &&
      !_pressedWallets.find((item) => item.id === _pressedItem.id)
    ) {
      _pressedWallets[1] = _pressedItem;
      dispatch(setPressWallets(_pressedWallets));
    } else {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressExInItem = (data) => {
    if (pressedExInItem && pressedExInItem.id === data.id) {
      dispatch(setPressExInItem(null));
    } else if (pressedWallets.length < 2) {
      dispatch(setPressExInItem(data));
    } else {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressExDate = (data) => {
    if (pressedDate && pressedDate.id === data.id) {
      dispatch(setPressDate(null));
    } else {
      dispatch(setPressDate(data));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    // console.log("*********************");
    // console.log(
    //   "wallet1 ",
    //   pressedWallets.length > 0 ? pressedWallets[0].name : "null"
    // );
    // console.log(
    //   "wallet2 ",
    //   pressedWallets.length > 1 ? pressedWallets[1].name : "null"
    // );
    // console.log("exInItem ", pressedExInItem ? pressedExInItem.name : "null");
    // console.log("date ", pressedDate);
    if (
      ((pressedWallets.length === 1 && pressedExInItem) ||
        (pressedWallets.length === 2 && !pressedExInItem)) &&
      pressedDate
    ) {
      navigation.navigate("AddScreen", {
        symbols: data.symbols,
        pressedWallets: [ ...pressedWallets ],
        pressedExInItem: { ...pressedExInItem },
        pressedDate: { ...pressedDate },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(resetAllPressStates())
    }
  }, [pressedWallets, pressedExInItem, pressedDate]);

  return (
    <View style={styles.container}>
      <Wallets navigation={navigation} data={data} onPress={onPressWallet} />
      <View style={styles.separator} />
      <ExInItems navigation={navigation} onPress={onPressExInItem} />
      <View style={styles.separator} />
      <Dates onPress={onPressExDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#181715",
  },
  separator: {
    width: 1, // or '100%' for a horizontal separator
    backgroundColor: "gray", // Color of the separator
    // Add padding or margin if you want space around the separator
  },
});
