const initialState = {
  isLoading: false,
  pressedWallet1: {},
  pressedWallet2: {},
  pressedExInItem: {},
  pressedDate: {},
  isIncome: false,
  mainCurrency: "USD",
  isConnectionError: false,
  editDocId: undefined,
  editContentType: undefined,
  editItem: undefined,
  walletsInMainCurrency: false
};

const stateReducer = (state = initialState, action) => {
    switch (action.type) {
      case "IS_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_PRESS_WALLET1":
        return { ...state, pressedWallet1: action.payload };
      case "SET_PRESS_WALLET2":
        return { ...state, pressedWallet2: action.payload };
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
      case "RESET_ALL_PRESS_STATES":
        return {
          ...state,
          pressedWallet1: {},
          pressedWallet2: {},
          pressedExInItem: {},
          pressedDate: {},
        };
      default:
        return state;
    }
  };
  
  export default stateReducer;
