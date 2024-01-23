import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setUsers } from "../actions";

async function syncUsers(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  const user = JSON.parse(await SecureStore.getItemAsync("user"));
  let [users_local, users] = [undefined, undefined];
  try {
    [users_local, users] = await Promise.all([
      getData("users"),
      fetchRequest(
        dispatch,
        token,
        null,
        "/users/",
        "GET",
        {
          family_group: user.family_group,
        },
        true
      ),
    ]);
  } catch {
    return;
  }

  if (needUpdate(users, users_local)) {
    storeData("users", users);
    dispatch(setUsers(user));
  }
}

export default syncUsers;
