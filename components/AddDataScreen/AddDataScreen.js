import { View, BackHandler, Vibration } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import Calculator from "./Calculator";
import AddHeader from "./AddHeader";
import { resetAllPressStates } from "../actions";
import { setEditDocId } from "../actions";

export default function AddDataScreen({navigation}) {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.mainState.transactions);
  const editDocId = useSelector((state) => state.stateReducer.editDocId);

  const [isDeleted, setIsDeleted] = useState(false);

  let trz = undefined
  if (editDocId) {
    trz = transactions.find((item) => item.doc_id === editDocId);
  }

  const onDelete = () => setIsDeleted(true)

  const onCancel = () => {
    // Vibration.vibrate(1);
    navigation.navigate("Tabs");
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onCancel
    );

    return () => {
      backHandler.remove();
      dispatch(resetAllPressStates());
      if (editDocId) {
        dispatch(setEditDocId(undefined))
      }
    };
  }, []);

  if (isDeleted) return null

  return (
    <View style={{flex: 1}}>
      <AddHeader navigation={navigation} trz={trz} onDelete={onDelete}/>
      <Calculator navigation={navigation} trz={trz}/>
    </View>
  );
}
