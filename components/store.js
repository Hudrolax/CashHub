import { configureStore } from '@reduxjs/toolkit';
import loginScreenReducer from './LoginScreen/reducer';
import mainReducer from './reducers/mainReducer'
import stateReducer from './reducers/stateReducer';

const store = configureStore({
  reducer: {
    login_screen: loginScreenReducer,
    mainState: mainReducer,
    stateReducer: stateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,  // Отключает immutableStateInvariantMiddleware
    serializableCheck: false,
  }),
});

export default store;
