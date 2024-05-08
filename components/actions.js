export const setIsLoading = (payload) => ({
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
export const setActiveTab = (payload) => ({
  type: "SET_ACTIVE_TAB",
  payload: payload,
});
export const setCheckList = (payload) => ({
  type: "SET_CHECKLIST",
  payload: payload,
});
export const setCheckAddMode = (payload) => ({
  type: "SET_CHECKLIST_ADD_MODE",
  payload: payload,
});
export const setCheckNewItemText = (payload) => ({
  type: "SET_CHECKLIST_NEWITEM_TEXT",
  payload: payload,
});
export const setLoginData = (token, user) => {
  return (dispatch) => {
    dispatch({
      type: "SET_LOGIN_DATA",
      payload: {
        token,
        user,
      },
    });
  };
};
export const setRecording = (payload) => ({
  type: "SET_RECORDING",
  payload: payload,
});
export const setRecognizedText = (payload) => ({
  type: "SET_RECOGNIZED_TEXT",
  payload: payload,
});
export const setOpenAPIKey = (payload) => ({
  type: "SET_OPENAI_API_KEY",
  payload: payload,
});