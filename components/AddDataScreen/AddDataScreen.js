import { View, BackHandler } from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

import Calculator from "./Calculator";
import AddHeader from "./AddHeader";
import { resetAllPressStates } from "../actions";

export default function AddDataScreen({ navigation, route }) {
  const { trz, pressedBtns } = route.params;
  const dispatch = useDispatch();

  const [isDeleted, setIsDeleted] = useState(false);

  const onDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsDeleted(true);
  };

  const onCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("Tabs");
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onCancel
    );

    return () => {
      backHandler.remove();
      dispatch(resetAllPressStates());
    };
  }, []);

  if (isDeleted) return null;

  return (
    <View style={{ flex: 1 }}>
      <AddHeader
        navigation={navigation}
        trz={trz}
        pressedBtns={pressedBtns}
        onDelete={onDelete}
      />
      {/* <Calculator navigation={navigation} trz={trz} /> */}
    </View>
  );
}
