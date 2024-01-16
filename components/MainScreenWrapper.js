import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";

import LoginScreen from "./LoginScreen/LoginScreen";
import MainScreen from "./MainScreen";
import { setToken, setUser, setIsLoadin, setMainCurrency } from "./actions";
import LoadingOverlay from "./loadingOverlay";
import { getData } from "./data";
import { updateData } from "./actions";

export default function MainScreenWrapper() {
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const isLoading = useSelector((state) => state.mainState.isLoading);
  const isConnectionError = useSelector(
    (state) => state.mainState.isConnectionError
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
      } else if (nextAppState.match(/inactive|background/)) {
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setIsLoadin(true));

      // load token
        const token = await SecureStore.getItemAsync("userToken");
        const user = JSON.parse(await SecureStore.getItemAsync("user"));
        dispatch(setToken(token ? token : ""));
        dispatch(setUser(user));

      // load main currency
      const mainCurrency = await getData("mainCurrency");
      dispatch(setMainCurrency(mainCurrency ? mainCurrency : 'USD'));

      // load data
      const currencies = await getData("currencies");
      const symbols = await getData("symbols");
      const wallets = await getData("wallets");
      const exInItems = await getData("exInItems");
      const trzExInItems = await getData("trzExInItems");
      const transactions = await getData("transactions");
      const users = await getData("users");

      dispatch(updateData(
        currencies ? currencies : [],
        symbols ? symbols : [],
        wallets ? wallets : [],
        exInItems ? exInItems : [],
        trzExInItems ? trzExInItems : [],
        transactions ? transactions : [],
        users ? users : [],
      ))

      dispatch(setIsLoadin(false));
    };
    loadData();
  }, [dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>
      {token ? <MainScreen /> : <LoginScreen />}
      <LoadingOverlay
        visible={isLoading || isConnectionError}
        connectionError={isConnectionError}
      />
    </View>
  );
}
