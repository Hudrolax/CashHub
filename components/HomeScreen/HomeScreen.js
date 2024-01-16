import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";

import Header from "./Header";
import ScrollColumns from "./ScrollColumns";
import ScrollColumnHeader from "./ScrollColumnHeader";
import {isEmpty} from "../util";

export default function HomeScreen({ navigation }) {
  const pressedWallet1 = useSelector((state) => state.mainState.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.mainState.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.mainState.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.mainState.pressedDate);
  const editDocId = useSelector((state) => state.mainState.editDocId);

  useEffect(() => {
    if (
      ((((!isEmpty(pressedWallet1) && !isEmpty(pressedExInItem)) ||
        (!isEmpty(pressedWallet1) && !isEmpty(pressedWallet2))) &&
      !isEmpty(pressedDate)) || editDocId) &&
      navigation
    ) {
      navigation.navigate("AddScreen");
    }
  }, [
    pressedWallet1,
    pressedWallet2,
    pressedExInItem,
    pressedDate,
    editDocId,
    navigation,
  ]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} style={{minHeight: '30%'}} />
      <ScrollColumnHeader navigation={navigation}/>
      <ScrollColumns navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
