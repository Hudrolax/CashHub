import {
  StyleSheet,
  View,
  Text,
  Vibration,
  BackHandler,
  TouchableHighlight,
} from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setEditItem } from "../actions";
import { WalletEditItem } from "./WalletEditItem";

export default function EditItemScreen({ navigation }) {
  const dispatch = useDispatch();
  editItem = useSelector((state) => state.mainState.editItem);

  const onCancel = () => {
    Vibration.vibrate(2);
    navigation.navigate("EditScreen");
    return true;
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

  return <WalletEditItem wallet={editItem}/>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
  },
});
