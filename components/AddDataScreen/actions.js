import { setIsLoadin } from "../actions";
import { baseEndpoint } from "../requests";
import { showAlert } from "../util";
import * as SecureStore from "expo-secure-store";
import { setLogin } from "../LoginScreen/actions";

const fetchRequest = (token, payload, endpoint, method, queryParams) => {
  return async (dispatch) => {
    dispatch(setIsLoadin(true));
    try {
      let headers = {
        "Content-Type": "application/json",
        TOKEN: token,
      };

      let url = baseEndpoint + endpoint;

      if (method === 'GET' && queryParams) {
        const query = new URLSearchParams(queryParams).toString();
        url += `?${query}`;
      }

      let params = {
        method: method,
        headers: headers,
      };

      if (method !== 'GET' && payload) {
        params.body = JSON.stringify(payload);
      }

      const response = await fetch(url, params);
      const data = await response.json();

      if (response.status === 401) {
        await SecureStore.setItemAsync("userToken", "");
        dispatch(setLogin(""));
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

export { fetchRequest };
