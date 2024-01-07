import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";

import HomeScreen from "./HomeScreen/HomeScreen";
import LogScreen from "./LogScreen/LogScreen";
import SettingsScreen from "./SettingsScreen/SettingsScreen";
import AddDataScreen from "./AddDataScreen/AddDataScreen";
import EditScreen from "./EditScreen/EditScreen";
import EditItemScreen from "./EditScreen/EditItemScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: { display: "none" }, // Скрывает tabBar
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logs" component={LogScreen} />
    </Tab.Navigator>
  );
}

export default function MainScreen() {
  return (
    <View style={{ flex: 1 }}>
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
