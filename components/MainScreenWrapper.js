import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";

import LoginScreen from "./LoginScreen/LoginScreen";
import MainScreen from "./MainScreen";
import {
  setLoginData,
  setIsLoading,
  setMainCurrency,
} from "./actions";
import LoadingOverlay from "./overlays/loadingOverlay";
import { getData } from "./data";
import RecordOverlay from "./overlays/RecordOverlay";

export default function MainScreenWrapper() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const isLoading = useSelector((state) => state.stateReducer.isLoading);
  const isConnectionError = useSelector(
    (state) => state.stateReducer.isConnectionError
  );
  const OPENAI_API_KEY = useSelector((state) => state.loginReducer.OPENAI_API_KEY);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setIsLoading(true));

      // load token
      const token = await SecureStore.getItemAsync("token");
      const user = JSON.parse(await SecureStore.getItemAsync("user"));
      const OPENAI_API_KEY = await SecureStore.getItemAsync("OPENAI_API_KEY");
      dispatch(setLoginData(token ? token : "", user, OPENAI_API_KEY ? OPENAI_API_KEY : ""));

      // load main currency
      const mainCurrency = await getData("mainCurrency");

      dispatch(setMainCurrency(mainCurrency ? mainCurrency : "USD"));

      dispatch(setIsLoading(false));
    };
    loadData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {token && OPENAI_API_KEY ? <MainScreen /> : <LoginScreen />}
      <LoadingOverlay
        visible={isLoading || isConnectionError}
        connectionError={isConnectionError}
      />
      <RecordOverlay />
    </View>
  );
}
