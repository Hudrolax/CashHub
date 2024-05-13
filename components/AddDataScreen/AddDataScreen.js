import { View } from "react-native";
import React from "react";

import Calculator from "./Calculator";
import AddHeader from "./AddHeader";

export default function AddDataScreen({ navigation, route }) {
  const { trz, symbols, pressedWallets, pressedExInItem, pressedDate } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <AddHeader
        navigation={navigation}
        trz={trz}
        pressedWallets={pressedWallets}
        pressedExInItem={pressedExInItem}
        pressedDate={pressedDate}
      />
      <Calculator
        navigation={navigation}
        trz={trz}
        symbols={symbols}
        pressedWallets={pressedWallets}
        pressedExInItem={pressedExInItem}
        pressedDate={pressedDate}
      />
    </View>
  );
}
