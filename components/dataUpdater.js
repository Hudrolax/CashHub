import * as SecureStore from "expo-secure-store";
import { baseEndpoint } from "./requests";

import { setIsLoading, setLoginData } from "./actions";
import { showAlert } from "./util";
import syncCurrencies from "./data/currencies";
import syncExInItems from "./data/exInItems";
import syncSymbols from "./data/symbols";
import syncUsers from "./data/users";
import syncWallets from "./data/wallets";
import syncTransactions from "./data/transactions";
import syncChecklist from "./data/checklist";

export const dispatchedFetchRequest = (
  token,
  payload,
  endpoint,
  method,
  queryParams
) => {
  return async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
      let headers = {
        "Content-Type": "application/json",
        TOKEN: token,
      };

      let url = baseEndpoint + endpoint;

      if (method === "GET" && queryParams) {
        const query = new URLSearchParams(queryParams).toString();
        url += `?${query}`;
      }

      let params = {
        method: method,
        headers: headers,
      };

      if (method !== "GET" && payload) {
        params.body = JSON.stringify(payload);
      }

      const response = await fetch(url, params);
      const data = await response.json();

      if (response.status === 401) {
        await SecureStore.setItemAsync("token", "");
        await SecureStore.setItemAsync("user", "");
        dispatch(setLoginData("", undefined));
        throw new Error("Ошибка авторизации");
      } else if (response.status !== 200) {
        throw new Error(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      showAlert((title = "Ошибка"), (text = error.message));
      console.error(error.message);
    }
    dispatch(setIsLoading(false));
  };
};

export const fetchHomeData = () => {
  return async (dispatch) => {
    await Promise.all([
      syncCurrencies(dispatch),
      syncExInItems(dispatch),
      syncSymbols(dispatch),
      syncUsers(dispatch),
    ]);
    await syncWallets(dispatch);
    await syncTransactions(dispatch);
    await syncChecklist(dispatch)
  };
};
