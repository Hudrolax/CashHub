import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "./Header";
import ScrollColumns from "./ScrollColumns";
import ScrollColumnHeader from "./ScrollColumnHeader";
import { fetchHomeData } from "./actions";
import isEmptyObject from "../util";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const pressedWallet1 = useSelector((state) => state.mainState.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.mainState.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.mainState.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.mainState.pressedDate);
  const editDocId = useSelector((state) => state.mainState.editDocId);
  const fetchTimerRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchHomeData(token));

      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }

      fetchTimerRef.current = setInterval(
        () => dispatch(fetchHomeData(token)),
        10000
      );

      return () => {
        if (fetchTimerRef.current) {
          clearInterval(fetchTimerRef.current);
        }
      };
    }, [dispatch, token]) // зависимости dispatch и token
  );

  useEffect(() => {
    if (
      ((((!isEmptyObject(pressedWallet1) && !isEmptyObject(pressedExInItem)) ||
        (!isEmptyObject(pressedWallet1) && !isEmptyObject(pressedWallet2))) &&
      !isEmptyObject(pressedDate)) || editDocId) &&
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
