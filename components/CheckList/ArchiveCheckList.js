import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Vibration,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeData } from "../data";

import { isEmpty } from "../util";
import ListItem from "./ListItem";
import Header from "./Header";
import { setCheckList } from "../actions";
// import { daysBetween } from "../util";

function ArchiveCheckList({ navigation, route }) {
  const dispatch = useDispatch();
  const _checklist = useSelector((state) => state.mainState.checklist);
  const [checklist, setChecklist_local] = useState([]);

  const onUpdate = async (item) => {
    // Vibration.vibrate(3)
    const new_checklist = _checklist.map((i) => {
      if (i.id === item.id) {
        return item;
      } else {
        return i;
      }
    });
    await storeData("checklist", new_checklist);
    dispatch(setCheckList(new_checklist));
  };

  useEffect(() => {
    if (!isEmpty(_checklist)) {
      setChecklist_local(
        _checklist
          .slice() // создаем копию массива для безопасной сортировки
          .filter((item) => item.checked)
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // для сортировки от новых к старым
          })
      );
    }
  }, [_checklist]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Значение смещения может потребовать настройки
      style={styles.container}
    >
      <Header navigation={navigation} caption={"Архив:"} btnName={'Назад'}/>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {checklist.map((item) => (
            <ListItem key={item.id} item={item} onUpdate={onUpdate} />
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
  },
});

export default ArchiveCheckList;
