import { configureStore } from '@reduxjs/toolkit';
import loginScreenReducer from './LoginScreen/reducer';
import mainReducer from './reducer'

const store = configureStore({
  reducer: {
    login_screen: loginScreenReducer,
    mainState: mainReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
