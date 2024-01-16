import * as SecureStore from "expo-secure-store";
import { storeData } from "./data";

import { baseEndpoint } from "./requests";
import {
  updateData,
  setIsLoadin,
  setToken,
  setUser,
  setConnectionError,
} from "./actions";
import { showAlert } from "./util";

export const dispatchedFetchRequest = (
  token,
  payload,
  endpoint,
  method,
  queryParams
) => {
  return async (dispatch) => {
    dispatch(setIsLoadin(true));
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
        await SecureStore.setItemAsync("userToken", "");
        await SecureStore.setItemAsync("user", undefined);
        dispatch(setToken(""));
        dispatch(setUser(undefined));
        throw new Error("Ошибка авторизации");
      } else if (response.status !== 200) {
        throw new Error(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      showAlert((title = "Ошибка"), (text = error.message));
      console.error(error.message);
    }
    dispatch(setIsLoadin(false));
  };
};

export const fetchRequest = async (
  dispatch,
  token,
  payload,
  endpoint,
  method,
  queryParams,
  throwError = false
) => {
  try {
    let headers = {
      "Content-Type": "application/json",
      TOKEN: token,
    };

    let url = baseEndpoint + endpoint;

    if (method === "GET" && queryParams) {
      let queryParts = [];
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          const value = queryParams[key];
          if (Array.isArray(value)) {
            value.forEach((item) =>
              queryParts.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
              )
            );
          } else {
            queryParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            );
          }
        }
      }
      const queryString = queryParts.join("&");
      url += `?${queryString}`;
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
      await SecureStore.setItemAsync("userToken", "");
      await SecureStore.setItemAsync("user", undefined);
      dispatch(setToken(""));
      dispatch(setUser(undefined));
      throw new Error("Ошибка авторизации");
    } else if (response.status !== 200) {
      throw new Error(JSON.stringify(data, null, 2));
    }

    dispatch(setConnectionError(false));
    return data;
  } catch (error) {
    dispatch(setConnectionError(true));
    console.error(error.message);
    if (throwError) throw error;
    return [];
  }
};

export const fetchHomeData = (token, user) => {
  return async (dispatch) => {
    // get data from DB
    let transactions = [];
    try {
      transactions = await fetchRequest(
        dispatch,
        token,
        null,
        "/wallet_transactions/",
        "GET",
        null,
        true
      );
    } catch {
      return;
    }
    const exInItemsIds = [
      ...new Set(transactions.map((trz) => trz.exin_item_id)),
    ];

    const [currencies, symbols, _wallets, exInItems, trzExInItems, users] =
      await Promise.all([
        fetchRequest(dispatch, token, null, "/currencies/", "GET"),
        fetchRequest(dispatch, token, null, "/symbols/", "GET"),
        fetchRequest(dispatch, token, null, "/wallets/", "GET"),
        fetchRequest(dispatch, token, null, "/exin_items/", "GET"),
        fetchRequest(dispatch, token, null, "/exin_items/", "GET", 
          [{ids: exInItemsIds}],
        ),
        fetchRequest(dispatch, token, null, "/users/", "GET", {family_group: user.family_group}),
      ]);

    // preprocessing wallets
    const wallets = _wallets.map((wallet) => {
      const currency = currencies.find((c) => c.id === wallet.currency_id);

      return {
        ...wallet,
        currency: currency ? currency : undefined,
      };
    });

    // store data
    await storeData("currencies", currencies);
    await storeData("symbols", symbols);
    await storeData("wallets", wallets);
    await storeData("exInItems", exInItems);
    await storeData("trzExInItems", trzExInItems);
    await storeData("transactions", transactions);
    await storeData("users", users);

    dispatch(
      updateData(
        currencies,
        symbols,
        wallets,
        exInItems,
        trzExInItems,
        transactions,
        users
      )
    );
  };
};
