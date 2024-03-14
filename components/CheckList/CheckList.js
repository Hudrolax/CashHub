import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../actions";
import { storeData, getData } from "../data";

import { isEmpty } from "../util";
import ListItem from "./ListItem";
import Header from "./Header";
import Footer from "./Footer";
import NewItem from "./NewItem";
import { setCheckList, setCheckAddMode } from "../actions";
import { setCheckNewItemText } from "../actions";
// import { daysBetween } from "../util";

function CheckList({ navigation, route }) {
  const dispatch = useDispatch();
  const _checklist = useSelector((state) => state.mainState.checklist);
  const user = useSelector((state) => state.login_screen.user);
  const [checklist, setChecklist_local] = useState([]);
  const addMode = useSelector((state) => state.stateReducer.checklistAddMode);
  const scrollViewRef = useRef();

  const onUpdate = async (item) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
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

  const onAdd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    scrollToTop();
    dispatch(setCheckAddMode(true));
  };

  const onCompleteAdd = async (text) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (!isEmpty(text)) {
      const payload = {
        id: new Date().toString(),
        text: text,
        date: new Date().toString(),
        checked: false,
        user_id: user.id,
        user: user,
        new: true,
        modified: true,
        deleted: false,
      };
      let checklist_local = await getData("checklist");
      if (!checklist_local) checklist_local = []
      checklist_local.push(payload);
      await storeData("checklist", checklist_local);
      dispatch(setCheckList(checklist_local));
    }

    dispatch(setCheckAddMode(false));
    dispatch(setCheckNewItemText(""));
  };

  useEffect(() => {
    if (!isEmpty(_checklist)) {
      setChecklist_local(
        _checklist
          .slice() // создаем копию массива для безопасной сортировки
          .filter((item) => !item.checked)
          .sort((a, b) => {
            // Сначала сортируем по checked, затем по дате
            if (a.checked === b.checked) {
              // Если элементы одинаково отмечены, сортируем по дате
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB - dateA; // для сортировки от новых к старым
            }
            return a.checked ? 1 : -1; // false элементы будут выше true
          })
      );
    }
  }, [_checklist]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));
      return () => {};
    }, [])
  );

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => onCompleteAdd("")
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Значение смещения может потребовать настройки
      style={styles.container}
    >
      <Header
        navigation={navigation}
        caption={"Список покупок:"}
        btnName={"Архив"}
      />
      <View style={{ flex: 1 }}>
        {addMode && <NewItem onComplete={onCompleteAdd} />}
        <ScrollView ref={scrollViewRef}>
          {checklist.map((item) => (
            <ListItem key={item.id} item={item} onUpdate={onUpdate} />
          ))}
        </ScrollView>
      </View>
      <Footer onAdd={onAdd} onComplete={onCompleteAdd} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
  },
});

export default CheckList;
