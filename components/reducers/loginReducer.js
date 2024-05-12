const initialState = {
  token: '',
  user: undefined
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN_DATA':
      return { ...state, token: action.payload.token, user: action.payload.user };
    default:
      return state;
  }
};

export default loginReducer;