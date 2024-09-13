const initialState = {
  token: '',
  user: undefined,
  OPENAI_API_KEY: undefined
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN_DATA':
      return { ...state, token: action.payload.token, user: action.payload.user, OPENAI_API_KEY: action.payload.openai_api_key };
    default:
      return state;
  }
};

export default loginReducer;