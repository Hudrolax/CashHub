import * as SecureStore from "expo-secure-store";
import { setLoginData, setIsLoading } from "./actions";

// const baseEndpoint = "http://192.168.1.104/api/v2";
const baseEndpoint = "http://80.77.25.24/api/v2";

export const wallet_transactions_endpoint = "/wallet_transactions/";
export const users_endpoint = "/users/";
export const wallets_endpoint = "/wallets/";
export const exin_items_endpoint = "/exin_items/"
export const exin_items_home_endpoint = "/exin_items/home_screen_items/"
export const checklist_endpoint = "/checklist/"
export const currencies_endpoint = "/currencies/"
export const symbols_endpoint = "/symbols/"

export { baseEndpoint };

export const backendRequest = async ({
  dispatch,
  token,
  payload,
  endpoint,
  method,
  queryParams,
  showLoadingOvarlay = false,
  throwError = false,
}) => {
  if (showLoadingOvarlay) dispatch(setIsLoading(true));
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
      await SecureStore.setItemAsync("token", "");
      await SecureStore.setItemAsync("user", "");
      dispatch(setLoginData("", undefined));
      throw new Error("Ошибка авторизации");
    } else if (response.status !== 200) {
      throw new Error(
        JSON.stringify({ data, status_code: response.status }, null, 2)
      );
    }

    return data;
  } catch (error) {
    console.error(error.message);
    if (throwError) throw error;
  } finally {
    if (showLoadingOvarlay) dispatch(setIsLoading(false));
  }
};
