import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setWallets } from "../actions";

async function syncWallets(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  let [wallets_local, _wallets, currencies] = [undefined, undefined, undefined];
  try {
    [wallets_local, _wallets, currencies] = await Promise.all([
      getData("wallets"),
      fetchRequest(dispatch, token, null, "/wallets/", "GET", null, true),
      getData("currencies"),
    ]);
  } catch {
    return;
  }
  if (!currencies) return;

  // preprocessing wallets
  let wallets = [];
  for (let i = 0; i < _wallets.length; i++) {
    const currency = currencies.find((c) => c.id === _wallets[i].currency_id);
    if (!currency) continue;

    wallets.push({
      ..._wallets[i],
      currency: currency,
    });
  }

  if (needUpdate(wallets, wallets_local)) {
    storeData("wallets", wallets);
    dispatch(setWallets(wallets));
  }
}

export default syncWallets;
