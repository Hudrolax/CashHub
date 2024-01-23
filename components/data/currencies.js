import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setCurrencies } from "../actions";

async function syncCurrencies(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  
  let [currencies_local, currencies] = [undefined, undefined]
  try {
    [currencies_local, currencies] = await Promise.all([
      getData("currencies"),
      fetchRequest(dispatch, token, null, "/currencies/", "GET", null, true),
    ]);
  } catch {
    return;
  }

  if (needUpdate(currencies, currencies_local)) {
    storeData("currencies", currencies);
    dispatch(setCurrencies(currencies));
  }
}

export default syncCurrencies;
