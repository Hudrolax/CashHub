import * as SecureStore from "expo-secure-store";
import { setLoginData } from "./actions";

// const baseEndpoint = "http://192.168.1.104/api/v1"
const baseEndpoint = "http://80.77.25.24/api/v1"

export {baseEndpoint}

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
        await SecureStore.setItemAsync("token", "");
        await SecureStore.setItemAsync("user", "");
        dispatch(setLoginData("", undefined));
        throw new Error("Ошибка авторизации");
      } else if (response.status !== 200) {
        throw new Error(JSON.stringify({data, status_code: response.status}, null, 2));
      }
  
      // dispatch(setConnectionError(false));
      return data;
    } catch (error) {
      // dispatch(setConnectionError(true));
      console.error(error.message);
      if (throwError) throw error;
      return [];
    }
  };