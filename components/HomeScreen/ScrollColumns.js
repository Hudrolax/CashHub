import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

import Wallets from "./Wallets";
import ExInItems from "./ExInItems";
import Dates from "./Dates";

export default function ScrollColumns({ navigation, data }) {
  const [pressedWallet1, setPressedWallet1] = useState(null);
  const [pressedWallet2, setPressedWallet2] = useState(null);
  const [pressedExInItem, setPressedExInItem] = useState(null);
  const [pressedDate, setPressedDate] = useState(null);

  const onPressWallet = (data) => {
    if (pressedWallet1 && pressedExInItem) return true;

    if (pressedWallet1 && pressedWallet2) return true;

    if (pressedWallet1) {
      setPressedWallet2(data)
    } else {
      setPressedWallet1(data)
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressExInItem = (data) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPressedExInItem(data);
  };

  const onPressExDate = (data) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPressedDate(data);
  };

  useEffect(() => {
    // console.log("wallet1 ", pressedWallet1);
    // console.log("wallet2 ", pressedWallet2);
    // console.log("exinitem ", pressedExInItem);
    // console.log("date ", pressedDate);
    if (pressedWallet1 && pressedExInItem && pressedDate)
      navigation.navigate("AddScreen", {
        pressedWallet1,
        pressedWallet2,
        pressedExInItem,
        pressedDate,
      });
  }, [pressedWallet1, pressedWallet2, pressedExInItem, pressedDate]);

  return (
    <View style={styles.container}>
      <Wallets navigation={navigation} data={data} onPress={onPressWallet} />
      <View style={styles.separator} />
      <ExInItems
        navigation={navigation}
        onPress={onPressExInItem}
        pressedExInItem={pressedExInItem}
        pressedWallet2={pressedWallet2}
      />
      <View style={styles.separator} />
      <Dates onPress={onPressExDate} pressedDate={pressedDate} />
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
