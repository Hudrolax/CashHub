import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setSymbols } from "../actions";

async function syncSymbols(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  let [symbols_local, symbols] = [undefined, undefined];
  try {
    [symbols_local, symbols] = await Promise.all([
      getData("symbols"),
      fetchRequest(dispatch, token, null, "/symbols/", "GET", null, true),
    ]);
  } catch {
    return;
  }

  if (needUpdate(symbols, symbols_local)) {
    storeData("symbols", symbols);
    dispatch(setSymbols(symbols));
  }
}

export default syncSymbols;
