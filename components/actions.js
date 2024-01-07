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