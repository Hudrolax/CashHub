const initialState = {
  token: '',
  username: ''
};

const loginScreenReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    default:
      return state;
  }
};

export default loginScreenReducer;