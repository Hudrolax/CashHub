const initialState = {
  currencies: [],
  symbols: [],
  wallets: [],
  exInItems: [],
  transactions: [],
  dates: [],
  users: [],
  checklist: [],
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENCIES":
      return { ...state, currencies: action.payload };
    case "SET_WALLETS":
      return { ...state, wallets: action.payload };
    case "SET_ExInItems":
      return { ...state, exInItems: action.payload };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_DATES":
      return { ...state, dates: action.payload };
    case "SET_SYMBOLS":
      return { ...state, symbols: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_CHECKLIST":
      return { ...state, checklist: action.payload };
    case "UPDATE_ALL_DATA":
      return {
        ...state,
        currencies: action.payload.currencies,
        symbols: action.payload.symbols,
        wallets: action.payload.wallets,
        exInItems: action.payload.exInItems,
        transactions: action.payload.transactions,
        users: action.payload.users,
        mainCurrency: action.payload.mainCurrency
      };
    default:
      return state;
  }
};

export default mainReducer;
