export const setIsLoadin = (payload) => ({
  type: "IS_LOADING",
  payload: payload,
});
export const setConnectionError = (payload) => ({
  type: "IS_CONNECTION_ERROR",
  payload: payload,
});
export const setMainCurrency = (payload) => ({
  type: "SET_MAIN_CURRENCY",
  payload: payload,
});
export const setEditDocId = (payload) => ({
  type: "SET_EDIT_DOC_ID",
  payload: payload,
});
export const setEditContentType = (payload) => ({
  type: "SET_EDIT_CONTENT_TYPE",
  payload: payload,
});
export const setEditItem = (payload) => ({
  type: "SET_EDIT_ITEM",
  payload: payload,
});
export const setWalletsInMainCurrency = (payload) => ({
  type: "SET_WALLETS_IN_MAIN_CURRENCY",
  payload: payload,
});
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
export const updateData = (currencies, symbols, wallets, exInItems, trzExInItems, transactions, users) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_ALL_DATA",
      payload: { currencies, symbols, wallets, exInItems, trzExInItems, transactions, users },
    });
  };
};
export const setToken = (payload) => ({ type: "SET_TOKEN", payload: payload });
export const setUser = (payload) => ({ type: "SET_USER", payload: payload });