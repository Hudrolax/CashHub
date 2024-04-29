import * as SecureStore from "expo-secure-store";
import { storeData, getData, needUpdate } from "../data";
import { fetchRequest } from "../requests";
import { setTransactions } from "../actions";
import { isEmpty, prepareTrzs } from "../util";

async function syncTransactions(dispatch) {
  // const start = Date.now();

  const token = await SecureStore.getItemAsync("token");

  let transactions_local = await getData("transactions");
  if (!transactions_local) transactions_local = [];
  let deletedId = [];
  let needStore = false;
  for (let i = 0; i < transactions_local.length; i++) {
    // **************** delete transactions ****************
    if (transactions_local[i].deleted) {
      if (transactions_local[i].new) {
        deletedId.push(i);
        needStore = true;
      } else {
        try {
          const result = await fetchRequest(
            dispatch,
            token,
            null,
            `/wallet_transactions/${transactions_local[i].doc_id}`,
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
            // return if can't delete the transaction
            return;
          }
        }
      }
    } else if (transactions_local[i].new) {
      // **************** add a transaction ****************
      let payload = {};
      if (!isEmpty(transactions_local[i].exInItem)) {
        payload = {
          wallet_from_id: transactions_local[i].wallet1.id,
          exin_item_id: transactions_local[i].exInItem.id,
          amount: transactions_local[i].amount1,
          date: transactions_local[i].date,
          comment: transactions_local[i].comment,
        };
      } else {
        payload = {
          wallet_from_id: transactions_local[i].wallet1.id,
          wallet_to_id: transactions_local[i].wallet2.id,
          exin_item_id: null,
          amount: transactions_local[i].amount1.slice(1),
          exchange_rate: Math.abs(
            transactions_local[i].amount2 / transactions_local[i].amount1
          ),
          date: transactions_local[i].date,
          comment: transactions_local[i].comment,
        };
      }
      const result = await fetchRequest(
        dispatch,
        token,
        payload,
        "/wallet_transactions/",
        "POST",
        null,
        true
      );
      if (!isEmpty(result) && result.length > 0 && result[0].doc_id) {
        transactions_local[i].doc_id = result[0].doc_id;
        needStore = true;
        transactions_local[i].new = false
        await storeData("transactions", transactions_local);
      }
    } else if (!transactions_local[i].new && transactions_local[i].modified) {
      // **************** modify a transaction ****************
      let payload = {};
      if (!isEmpty(transactions_local[i].exInItem)) {
        payload = {
          wallet_from_id: transactions_local[i].wallet1.id,
          wallet_to_id: null,
          exin_item_id: transactions_local[i].exInItem.id,
          exchange_rate: null,
          amount: transactions_local[i].amount1,
          date: transactions_local[i].date,
          comment: transactions_local[i].comment,
          doc_id: transactions_local[i].doc_id,
        };
      } else {
        payload = {
          wallet_from_id: transactions_local[i].wallet1.id,
          wallet_to_id: transactions_local[i].wallet2.id,
          exin_item_id: null,
          amount: transactions_local[i].amount1.slice(1),
          exchange_rate: Math.abs(
            transactions_local[i].amount2 / transactions_local[i].amount1
          ),
          date: transactions_local[i].date,
          comment: transactions_local[i].comment,
          doc_id: transactions_local[i].doc_id,
        };
      }
      const result = await fetchRequest(
        dispatch,
        token,
        payload,
        `/wallet_transactions/${transactions_local[i].doc_id}`,
        "PUT",
        null,
        true
      );
      if (!isEmpty(result) && result.length > 0 && result[0].doc_id) {
        transactions_local[i].doc_id = result[0].doc_id;
        needStore = true;
        transactions_local[i].modified = false
        await storeData("transactions", transactions_local);
      }
    }
  }

  transactions_local = transactions_local.filter((element, index) => {
    return !deletedId.includes(index);
  });

  if (needStore) await storeData("transactions", transactions_local);

  // get transactions from server
  let [_transactions, exInItems, wallets, users] = [[], [], [], []];
  try {
    [_transactions, exInItems, wallets, users] = await Promise.all([
      fetchRequest(
        dispatch,
        token,
        null,
        "/wallet_transactions/",
        "GET",
        null,
        true
      ),
      getData("exInItems"),
      getData("wallets"),
      getData("users"),
    ]);
  } catch (error) {
    return;
  }
  // console.log(_transactions)

  if (!exInItems || !wallets || !users) return;

  // preprocessing transactions
  let transactions = prepareTrzs(_transactions, exInItems, wallets, users);

  if (needUpdate(transactions, transactions_local)) {
    storeData("transactions", transactions);
    dispatch(setTransactions(transactions));
  }
  // console.log(`Время выполнения: ${Date.now() - start} мс`);
}

export default syncTransactions;
