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

import { isEmpty, showAlert } from "../util";
import ListItem from "./ListItem";
import Header from "./Header";
import Footer from "./Footer";
import NewItem from "./NewItem";
import { backendRequest, checklist_endpoint } from "../requests";

function CheckList({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const [checklist, setChecklist] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [addMode, setAddMode] = useState(false)
  const scrollViewRef = useRef();

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
      setNeedUpdate(!needUpdate);
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
      setNeedUpdate(!needUpdate);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      showAlert(
        "Ошибка",
        "Не удалось удалить элемент. Возможно нет интернета."
      );
    }
  };

  const onAdd = () => {
    setAddMode(true)
    scrollToTop();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const onCompleteAdd = async (text) => {
    if (!isEmpty(text)) {
      try {
        const payload = {text}
        await backendRequest({
          dispatch,
          token,
          endpoint: checklist_endpoint,
          method: "POST",
          payload,
          throwError: true,
          showLoadingOvarlay: true,
        });
        setNeedUpdate(!needUpdate);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        showAlert(
          "Ошибка",
          "Не удалось удалить элемент. Возможно нет интернета."
        );
      } finally {
        setAddMode(false)
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveTab(route.name));
      const loadData = async () => {
        try {
          const result = await backendRequest({
            dispatch,
            token,
            endpoint: checklist_endpoint,
            method: "GET",
            queryParams: { archive: false },
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
            <ListItem
              key={item.id}
              item={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
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
