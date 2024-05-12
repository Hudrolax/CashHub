import React, { useRef, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import HomeScreen from "./HomeScreen/HomeScreen";
import LogScreen from "./LogScreen/LogScreen";
// import SettingsScreen from "./SettingsScreen/SettingsScreen";
import AddDataScreen from "./AddDataScreen/AddDataScreen";
// import EditScreen from "./EditScreen/EditScreen";
// import EditItemScreen from "./EditScreen/EditItemScreen";
import CurrencySelector from "./HomeScreen/CurrencySelector";
// import CheckList from "./CheckList/CheckList";
// import ArchiveCheckList from "./CheckList/ArchiveCheckList";
// import AIAddScreen from "./AIAddScreen/AIAddScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabScreen() {
  const activeTabName = useSelector((state) => state.stateReducer.activeTab);
  return (
    <View style={{ flex: 1 }}>
      {activeTabName !== "CheckList" && (
        <CurrencySelector
          style={{ position: "absolute", top: "1%", right: "3%", zIndex: 3000 }}
        />
      )}

      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          swipeEnabled: true,
          tabBarStyle: { display: "none" }, // Скрывает tabBar
        }}
      >
        {/* <Tab.Screen name="CheckList" component={CheckList} /> */}
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Logs" component={LogScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function MainScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Настройки" }}
      /> */}
      <Stack.Screen
        name="AddScreen"
        component={AddDataScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="EditScreen"
        component={EditScreen}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="ArchiveChecklist"
        component={ArchiveCheckList}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="AIAddScreen"
        component={AIAddScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
