import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import {
  setPressWallet1,
  setPressWallet2,
  setPressExInItem,
  setPressDate,
} from "../actions";

import Wallets from "./Wallets";
import ExInItems from "./ExInItems";
import Dates from "./Dates";

export default function ScrollColumns({ navigation, data }) {
  const dispatch = useDispatch();
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

  const onPressWallet = (data) => {
    if (pressedWallet1 && pressedWallet1.id === data.id) {
      dispatch(setPressWallet1(null));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (!pressedWallet1) {
      dispatch(setPressWallet1(data));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (pressedWallet1 && !pressedWallet2 && !pressedExInItem) {
      dispatch(setPressWallet2(data));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (
      pressedWallet1 &&
      pressedWallet2 &&
      pressedWallet2.id !== data.id &&
      pressedWallet1.id !== data.id
    ) {
      dispatch(setPressWallet2(data));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (pressedWallet2 && pressedWallet2.id === data.id) {
      dispatch(setPressWallet2(null));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const onPressExInItem = (data) => {
    if (pressedExInItem && pressedExInItem.id === data.id) {
      dispatch(setPressExInItem(null));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (!pressedWallet2) {
      dispatch(setPressExInItem(data));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const onPressExDate = (data) => {
    if (pressedDate && pressedDate.id === data.id) {
      dispatch(setPressDate(null));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      dispatch(setPressDate(data));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  useEffect(() => {
    if (pressedWallet1 && pressedExInItem && pressedDate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate("AddScreen", {
        pressedWallet1: { ...pressedWallet1 },
        pressedWallet2: { ...pressedWallet2 },
        pressedExInItem: { ...pressedExInItem },
        pressedDate: { ...pressedDate },
      });
    }
  }, [pressedWallet1, pressedWallet2, pressedExInItem, pressedDate]);

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
