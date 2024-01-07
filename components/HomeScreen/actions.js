import { baseEndpoint } from "../requests";
import { setLogin } from "../LoginScreen/actions";
import * as SecureStore from "expo-secure-store";
import { setConnectionError } from "../actions";

export const setFetchTimer = (payload) => ({
  type: "SET_FETCH_TIMER",
  payload: payload,
});
export const setCurrencies = (payload) => ({
  type: "SET_CURRENCIES",
  payload: payload,
});
export const setWallets = (payload) => ({
  type: "SET_WALLETS",
  payload: payload,
});
export const setExInItems = (payload) => ({
  type: "SET_ExInItems",
  payload: payload,
});
export const setTransactions = (payload) => ({
  type: "SET_TRANSACTIONS",
  payload: payload,
});
export const setDates = (payload) => ({
  type: "SET_DATES",
  payload: payload,
});
export const setPressWallet1 = (payload) => ({
  type: "SET_PRESS_WALLET1",
  payload: payload,
});
export const setPressWallet2 = (payload) => ({
  type: "SET_PRESS_WALLET2",
  payload: payload,
});
export const setPressExInItem = (payload) => ({
  type: "SET_PRESS_EXINITEM",
  payload: payload,
});
export const setPressDate = (payload) => ({
  type: "SET_PRESS_DATE",
  payload: payload,
});
export const resetAllPressStates = () => ({
  type: "RESET_ALL_PRESS_STATES",
});
export const setIncome = (payload) => ({
  type: "SET_INCOME",
  payload: payload,
});
export const setSymbols = (payload) => ({
  type: "SET_SYMBOLS",
  payload: payload,
});

const fetchData = async (token, dispatch, endpoint) => {
  try {
    const response = await fetch(baseEndpoint + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        TOKEN: token,
      },
    });
    const data = await response.json();

    if (response.status !== 200) {
      if (response.status === 401) {
        await SecureStore.setItemAsync("userToken", "");
        dispatch(setLogin(""));
      }
      throw new Error(data.detail);
    }

    dispatch(setConnectionError(false))
    return data;
  } catch (error) {
    dispatch(setConnectionError(true))
    // showAlert(
    //   (title = "Ошибка"),
    //   (text =
    //     "Ошибка соединения с сервером. Проверьте подключение к интернету.")
    // );
    // console.error(error.message);
    return [];
  }
};

const updateData = (currencies, symbols, wallets, exInItems, transactions) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_ALL_DATA",
      payload: { currencies, symbols, wallets, exInItems, transactions },
    });
  };
};

const fetchHomeData = (token) => {
  return async (dispatch) => {
    // Выполнение всех запросов параллельно
    const [currencies, symbols, _wallets, exInItems, transactions] =
      await Promise.all([
        fetchData(token, dispatch, "/currencies/"),
        fetchData(token, dispatch, "/symbols/"),
        fetchData(token, dispatch, "/wallets/"),
        fetchData(token, dispatch, "/exin_items/"),
        fetchData(token, dispatch, "/wallet_transactions/"),
      ]);

    // preprocessing wallets
    const wallets = _wallets.map((wallet) => {
      const currency = currencies.find((c) => c.id === wallet.currency_id);

      return {
        ...wallet,
        currency: currency ? currency : undefined,
      };
    });

    dispatch(updateData(currencies, symbols, wallets, exInItems, transactions));
  };
};

export { fetchHomeData };
