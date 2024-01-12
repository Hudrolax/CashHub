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
export const setTrzExInItems = (payload) => ({
  type: "SET_TRZ_ExInItems",
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

const fetchData = async (token, dispatch, endpoint, queryParams) => {
  try {
    let url = baseEndpoint + endpoint;
    if (queryParams && queryParams.ids) {
      const idsParams = queryParams.ids.map(id => `ids=${encodeURIComponent(id)}`).join('&');
      url += `?${idsParams}`;
    }

    const response = await fetch(url, {
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

    dispatch(setConnectionError(false));
    return data;
  } catch (error) {
    dispatch(setConnectionError(true));
    return [];
  }
};

const updateData = (currencies, symbols, wallets, exInItems, trzExInItems, transactions) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_ALL_DATA",
      payload: { currencies, symbols, wallets, exInItems, trzExInItems, transactions },
    });
  };
};

const fetchHomeData = (token) => {
  return async (dispatch) => {
    // Выполнение всех запросов параллельно
    const transactions = await fetchData(token, dispatch, "/wallet_transactions/");
    const exInItemsIds = [
      ...new Set(transactions.map((trz) => trz.exin_item_id)),
    ];

    const [currencies, symbols, _wallets, exInItems, trzExInItems] = await Promise.all([
      fetchData(token, dispatch, "/currencies/"),
      fetchData(token, dispatch, "/symbols/"),
      fetchData(token, dispatch, "/wallets/"),
      fetchData(token, dispatch, "/exin_items/"),
      fetchData(token, dispatch, "/exin_items/", {ids: exInItemsIds}),
    ]);

    // preprocessing wallets
    const wallets = _wallets.map((wallet) => {
      const currency = currencies.find((c) => c.id === wallet.currency_id);

      return {
        ...wallet,
        currency: currency ? currency : undefined,
      };
    });

    dispatch(updateData(currencies, symbols, wallets, exInItems, trzExInItems, transactions));
  };
};

export { fetchHomeData };
