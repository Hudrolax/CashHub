import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setExInItems } from "../actions";

async function syncExInItems(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  let [exInItems_local, exInItems] = [undefined, undefined];
  try {
    [exInItems_local, exInItems] = await Promise.all([
      getData("exInItems"),
      fetchRequest(dispatch, token, null, "/exin_items/", "GET", null, true),
    ]);
  } catch {
    return;
  }

  if (needUpdate(exInItems, exInItems_local)) {
    storeData("exInItems", exInItems);
    dispatch(setExInItems(exInItems));
  }
}

export default syncExInItems;
