import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";

import LoginScreen from "./LoginScreen/LoginScreen";
import MainScreen from "./MainScreen";
import {
  setLoginData,
  setIsLoading,
  updateData,
  setMainCurrency,
  resetAllPressStates,
  setOpenAPIKey,
} from "./actions";
import LoadingOverlay from "./loadingOverlay";
import { getData } from "./data";
import { setCheckList } from "./actions";
import RecordOverlay from "./RecordOverlay";
import GetAPIKey from "./GetAPIKey";
import { isEmpty } from "./util";

export default function MainScreenWrapper() {
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login_screen.token);
  const isLoading = useSelector((state) => state.stateReducer.isLoading);
  const isConnectionError = useSelector(
    (state) => state.stateReducer.isConnectionError
  );
  const OPENAI_API_KEY = useSelector((state) => state.stateReducer.OPENAI_API_KEY);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
      } else if (nextAppState.match(/inactive|background/)) {
        dispatch(resetAllPressStates());
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

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

      // load data
      const currencies = await getData("currencies");
      const symbols = await getData("symbols");
      const wallets = await getData("wallets");
      const exInItems = await getData("exInItems");
      const transactions = await getData("transactions");
      const users = await getData("users");
      const checklist = await getData("checklist");

      dispatch(
        updateData(
          currencies ? currencies : [],
          symbols ? symbols : [],
          wallets ? wallets : [],
          exInItems ? exInItems : [],
          transactions ? transactions : [],
          users ? users : []
        )
      );
      dispatch(setMainCurrency(mainCurrency ? mainCurrency : "USD"));
      dispatch(setCheckList(checklist ? checklist : []));

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
