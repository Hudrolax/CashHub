const initialState = {
  isLoading: false,
  currencies: [],
  symbols: [],
  wallets: [],
  exInItems: [],
  trzExInItems: [],
  transactions: [],
  dates: [],
  fetchTimer: {},
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
  walletsInMainCurrency: false,
  users: []
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CURRENCIES":
      return { ...state, currencies: action.payload };
    case "SET_WALLETS":
      return { ...state, wallets: action.payload };
    case "SET_ExInItems":
      return { ...state, exInItems: action.payload };
    case "SET_TRZ_ExInItems":
      return { ...state, trzExInItems: action.payload };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_DATES":
      return { ...state, dates: action.payload };
    case "SET_FETCH_TIMER":
      return { ...state, fetchTimer: action.payload };
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
    case "SET_SYMBOLS":
      return { ...state, symbols: action.payload };
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
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "RESET_ALL_PRESS_STATES":
      return {
        ...state,
        pressedWallet1: {},
        pressedWallet2: {},
        pressedExInItem: {},
        pressedDate: {},
      };
    case "UPDATE_ALL_DATA":
      return {
        ...state,
        currencies: action.payload.currencies,
        symbols: action.payload.symbols,
        wallets: action.payload.wallets,
        exInItems: action.payload.exInItems,
        trzExInItems: action.payload.trzExInItems,
        transactions: action.payload.transactions,
        users: action.payload.users
      };
    default:
      return state;
  }
};

export default mainReducer;
