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
  setOpenAPIKey,
} from "./actions";
import LoadingOverlay from "./overlays/loadingOverlay";
import { getData } from "./data";
import RecordOverlay from "./overlays/RecordOverlay";
import GetAPIKey from "./LoginScreen/GetAPIKey";
import { isEmpty } from "./util";

export default function MainScreenWrapper() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const isLoading = useSelector((state) => state.stateReducer.isLoading);
  const isConnectionError = useSelector(
    (state) => state.stateReducer.isConnectionError
  );
  const OPENAI_API_KEY = useSelector((state) => state.stateReducer.OPENAI_API_KEY);

  useEffect(() => {
    const loadData = async () => {
      dispatch(setIsLoading(true));

      // load token
      const token = await SecureStore.getItemAsync("token");
      const user = JSON.parse(await SecureStore.getItemAsync("user"));
      const OPENAI_API_KEY = await SecureStore.getItemAsync("OPENAI_API_KEY");
      dispatch(setLoginData(token ? token : "", user));

      // load main currency
      const mainCurrency = await getData("mainCurrency");

      dispatch(setMainCurrency(mainCurrency ? mainCurrency : "USD"));

      if (!isEmpty(OPENAI_API_KEY)) {
        dispatch(setOpenAPIKey(OPENAI_API_KEY));
      }

      dispatch(setIsLoading(false));
    };
    loadData();
  }, []);

  if (!OPENAI_API_KEY) {
    return <GetAPIKey />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {token ? <MainScreen /> : <LoginScreen />}
      <LoadingOverlay
        visible={isLoading || isConnectionError}
        connectionError={isConnectionError}
      />
      <RecordOverlay />
    </View>
  );
}
