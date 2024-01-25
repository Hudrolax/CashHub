import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setCheckList } from "../actions";
import { isEmpty } from "../util";

async function syncChecklist(dispatch) {
  const token = await SecureStore.getItemAsync("token");
  
  try {
    let [checklist_local, users] = await Promise.all([
      getData("checklist"),
      getData("users"),
    ]);
    if (!checklist_local) checklist_local = [] 
    if (!users) return

    let deletedId = [];
    let needStore = false;
    for (let i = 0; i < checklist_local.length; i++) {
      // **************** delete checklist items ****************
      if (checklist_local[i].deleted) {
        if (checklist_local[i].new) {
          deletedId.push(i);
          needStore = true;
        } else {
          try {
            const result = await fetchRequest(
              dispatch,
              token,
              null,
              `/checklist/${checklist_local[i].id}`,
              "DELETE",
              null,
              true
            );
            if (result) {
              deletedId.push(i);
              needStore = true;
            }
          } catch (error) {
            const response = JSON.parse(error.message);
            if (response.status_code === 404) {
              deletedId.push(i);
              needStore = true;
            } else {
              // return if can't delete the checklist item
              return;
            }
          }
        }
      } else if (checklist_local[i].new) {
        // **************** add a checklist litem ****************
        let payload = {text: checklist_local[i].text};
        const result = await fetchRequest(
          dispatch,
          token,
          payload,
          "/checklist/",
          "POST",
          null,
          true
        );
        if (!isEmpty(result) && result.length > 0 && result[0].id) {
          checklist_local[i].id = result[0].id;
          needStore = true;
        }
      } else if (!checklist_local[i].new && checklist_local[i].modified) {
        // **************** modify a checklist item ****************
        let payload = {checked: checklist_local[i].checked};
        const result = await fetchRequest(
          dispatch,
          token,
          payload,
          `/checklist/${checklist_local[i].id}`,
          "PUT",
          null,
          true
        );
        if (!isEmpty(result) && result.length > 0 && result[0].id) {
          checklist_local[i].id = result[0].id;
          needStore = true;
        }
      }
    }
    checklist_local = checklist_local.filter((element, index) => {
      return !deletedId.includes(index);
    });
  
    if (needStore) await storeData("checklist", checklist_local);

    let checklist = await fetchRequest(dispatch, token, null, "/checklist/", "GET", null, true)

    for (let i = 0; i < checklist.length; i++) {
        const user = users.find(u => u.id === checklist[i].user_id)
        if (!user) {
            console.error('user not found. Userlist: ' + JSON.stringify(users))
            return
        }
        checklist[i].user = user
        checklist[i].new = false
        checklist[i].modified = false
        checklist[i].deleted = false
    }

    if (needUpdate(checklist, checklist_local)) {
        storeData("checklist", checklist);
        dispatch(setCheckList(checklist));
      }
  } catch {
    return;
  }

}

export default syncChecklist;