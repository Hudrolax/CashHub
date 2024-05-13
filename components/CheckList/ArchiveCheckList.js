import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { backendRequest, checklist_endpoint } from "../requests";

import ListItem from "./ListItem";
import Header from "./Header";
import { showAlert } from "../util";

function ArchiveCheckList({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [checklist, setChecklist] = useState([]);

  const onUpdate = async (item) => {
    try {
      await backendRequest({
        dispatch,
        token,
        endpoint: checklist_endpoint + `/${item.id}`,
        method: "PATCH",
        payload: { checked: item.checked },
        throwError: true,
        showLoadingOvarlay: true,
      });
      setNeedUpdate(!needUpdate)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      showAlert("Ошибка", "Похоже проблемы с подключением.");
    }
  };

  const onDelete = async (item) => {
    try {
      await backendRequest({
        dispatch,
        token,
        endpoint: checklist_endpoint + `/${item.id}`,
        method: "DELETE",
        throwError: true,
        showLoadingOvarlay: true,
      });
      setNeedUpdate(!needUpdate)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      showAlert(
        "Ошибка",
        "Не удалось удалить элемент. Возможно нет интернета."
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const result = await backendRequest({
            dispatch,
            token,
            endpoint: checklist_endpoint,
            method: "GET",
            queryParams: { archive: true },
            throwError: true,
            showLoadingOvarlay: true,
          });
          setChecklist(result);
        } catch {
          showAlert(
            "Ошибка",
            "Не удалось загрузить чеклист. Возможно нет интернета."
          );
        }
      };
      loadData();
      return () => {};
    }, [needUpdate])
  );

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
            <ListItem key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete}/>
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
