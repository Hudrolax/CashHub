import { setIsLoadin } from "../actions";
import { baseEndpoint } from "../requests";
import { showAlert } from "../util";

const fetchRequest = (token, payload, endpoint, method) => {
  return async (dispatch) => {
    dispatch(setIsLoadin(true));
    try {
      let params = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          TOKEN: token,
        },
      };
      if (payload) {
        params.body = JSON.stringify(payload);
      }
      const response = await fetch(baseEndpoint + endpoint, {
        ...params,
      });
      const data = await response.json();

      if (response.status === 401) {
        throw new Error("Ошибка авторизации");
      } else if (response.status !== 200) {
        throw new Error(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      showAlert((title = "Ошибка"), (text = error.message));
      console.error(error.message);
    }
    dispatch(setIsLoadin(false));
  };
};

export { fetchRequest };
