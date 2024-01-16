import React, { useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import HomeScreen from "./HomeScreen/HomeScreen";
import LogScreen from "./LogScreen/LogScreen";
import SettingsScreen from "./SettingsScreen/SettingsScreen";
import AddDataScreen from "./AddDataScreen/AddDataScreen";
import EditScreen from "./EditScreen/EditScreen";
import EditItemScreen from "./EditScreen/EditItemScreen";
import CurrencySelector from "./HomeScreen/CurrencySelector";

import { fetchHomeData } from "./dataUpdater";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CurrencySelector
        style={{ position: "absolute", top: "1%", right: "3%", zIndex: 3000 }}
      />

      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarStyle: { display: "none" }, // Скрывает tabBar
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Logs" component={LogScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function MainScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const fetchTimerRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchHomeData(token));

      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }

      fetchTimerRef.current = setInterval(
        () => dispatch(fetchHomeData(token)),
        5000
      );

      return () => {
        if (fetchTimerRef.current) {
          clearInterval(fetchTimerRef.current);
        }
      };
    }, [dispatch, token]) // зависимости dispatch и token
  );

  return (
    <View style={{ flex: 1}}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Настройки" }}
        />
        <Stack.Screen
          name="AddScreen"
          component={AddDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditScreen"
          component={EditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditItem"
          component={EditItemScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
}
