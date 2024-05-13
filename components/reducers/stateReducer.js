const initialState = {
  isLoading: false,
  pressedWallets: [],
  pressedExInItem: null,
  pressedDate: null,
  isIncome: false,
  mainCurrency: "USD",
  isConnectionError: false,
  editDocId: undefined,
  editContentType: undefined,
  editItem: undefined,
  walletsInMainCurrency: false,
  activeTab: undefined,
  recording: null,
  recognizedText: "",
  OPENAI_API_KEY: "",
};

const stateReducer = (state = initialState, action) => {
    switch (action.type) {
      case "IS_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_PRESS_WALLETS":
        return { ...state, pressedWallets: action.payload };
      case "SET_PRESS_EXINITEM":
        return { ...state, pressedExInItem: action.payload };
      case "SET_PRESS_DATE":
        return { ...state, pressedDate: action.payload };
      case "SET_INCOME":
        return { ...state, isIncome: action.payload };
      case "SET_MAIN_CURRENCY":
        return { ...state, mainCurrency: action.payload };
      case "IS_CONNECTION_ERROR":
        return { ...state, isConnectionError: action.payload };
      case "SET_EDIT_DOC_ID":
        return { ...state, editDocId: action.payload };
      case "SET_EDIT_CONTENT_TYPE":
        return { ...state, editContentType: action.payload };
      case "SET_EDIT_ITEM":
        return { ...state, editItem: action.payload };
      case "SET_WALLETS_IN_MAIN_CURRENCY":
        return { ...state, walletsInMainCurrency: action.payload };
      case "SET_ACTIVE_TAB":
        return { ...state, activeTab: action.payload };
      case "SET_RECORDING":
        return { ...state, recording: action.payload };
      case "SET_RECOGNIZED_TEXT":
        return { ...state, recognizedText: action.payload };
      case "SET_OPENAI_API_KEY":
        return { ...state, OPENAI_API_KEY: action.payload };
      case "RESET_ALL_PRESS_STATES":
        return {
          ...state,
          pressedWallets: [],
          pressedExInItem: null,
          pressedDate: null,
        };
      default:
        return state;
    }
  };
  
  export default stateReducer;
