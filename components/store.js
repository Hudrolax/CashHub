import { configureStore } from '@reduxjs/toolkit';
import loginScreenReducer from './reducers/loginReducer';
import stateReducer from './reducers/stateReducer';

const store = configureStore({
  reducer: {
    login_screen: loginScreenReducer,
    stateReducer: stateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,  // Отключает immutableStateInvariantMiddleware
    serializableCheck: false,
  }),
});

export default store;
