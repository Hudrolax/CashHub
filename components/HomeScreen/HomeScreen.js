import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "./Header";
import ScrollColumns from "./ScrollColumns";
import ScrollColumnHeader from "./ScrollColumnHeader";
import { isEmpty } from "../util";
import { setActiveTab } from "../actions";

export default function HomeScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const pressedWallet1 = useSelector((state) => state.stateReducer.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.stateReducer.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.stateReducer.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.stateReducer.pressedDate);
  const editDocId = useSelector((state) => state.stateReducer.editDocId);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));

      return () => {};
    }, [])
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
      <View style={{flex: 0.5, backgroundColor: "#1f1e1b",}}>
        <Image
          source={require("../../assets/home_background.jpg")}
          style={styles.backgroudImage}
          resizeMode="cover"
        ></Image>
        <Header navigation={navigation} style={{flex: 1}} />
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3
  },
});
