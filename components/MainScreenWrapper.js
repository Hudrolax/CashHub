import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";

import LoginScreen from "./LoginScreen/LoginScreen";
import MainScreen from "./MainScreen";
import { setLogin, setUsername } from "./LoginScreen/actions";
import LoadingOverlay from "./loadingOverlay";
import { setIsLoadin, setMainCurrency } from "./actions";
import { statusBarStyle } from "./colors";

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
        console.log("App has come to the foreground!");
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App has gone to the background!");
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const loadToken = async () => {
      dispatch(setIsLoadin(true));
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const username = await SecureStore.getItemAsync("username");
        const mainCurrency = await SecureStore.getItemAsync("mainCurrency");
        dispatch(setLogin(token));
        dispatch(setUsername(username));
        dispatch(setMainCurrency(mainCurrency ? mainCurrency : 'USD'));
      } catch {
        dispatch(setLogin(""));
      }
      dispatch(setIsLoadin(false));
    };
    loadToken();
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      {token ? <MainScreen /> : <LoginScreen />}
      <StatusBar style={statusBarStyle} />
      <LoadingOverlay
        visible={isLoading || isConnectionError}
        connectionError={isConnectionError}
      />
    </View>
  );
}
