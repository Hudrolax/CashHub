import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer';
import stateReducer from './reducers/stateReducer';

const store = configureStore({
  reducer: {
    loginReducer: loginReducer,
    stateReducer: stateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,  // Отключает immutableStateInvariantMiddleware
    serializableCheck: false,
  }),
});

export default store;
