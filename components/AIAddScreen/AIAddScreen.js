import * as SecureStore from "expo-secure-store";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  Vibration,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackBtn from "../CheckList/BackBtn";
import CircleButton from "./CircleButton";
import {
  setRecording,
  setRecognizedText,
  setTransactions,
  setWallets,
} from "../actions";
import { startRecording, GPTTransactions, getRate, isEmpty } from "../util";
import { blueColor } from "../colors";
import Transaction from "./Transaction";
import AddButton from "./AddBtn";
import { getData, storeData } from "../data";

function AIAddScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const recognizedText = useSelector(
    (state) => state.stateReducer.recognizedText
  );
  const scrollViewRef = useRef();
  const [recognized_transactions, setRecognizedTransactions] = useState(null);
  const exInItems = useSelector((state) => state.mainState.exInItems);
  const wallets = useSelector((state) => state.mainState.wallets);
  const symbols = useSelector((state) => state.mainState.symbols);

  const onStartRecording = async () => {
    Vibration.vibrate(1);
    dispatch(setRecording(await startRecording()));
  };

  const onDelete = (index) => {
    let _trzs = [];
    for (let i = 0; i < recognized_transactions.length; i++) {
      if (index != i) {
        _trzs.push(recognized_transactions[i]);
      }
    }
    setRecognizedTransactions(_trzs);
  };

  const onChange = (index, type, text) => {
    let _trzs = [];
    for (let i = 0; i < recognized_transactions.length; i++) {
      let trz = recognized_transactions[i];
      if (index == i) {
        if (type == "comment") {
          trz.comment = text;
        } else if (type == "summ") {
          trz.summ = text;
        } else if (type == "exin_item") {
          trz.exin_item = exInItems.find((i) => i.name == text);
        } else if (type == "wallet") {
          trz.wallet = wallets.find((i) => i.name == text);
        } else {
          throw new Error(`wrong onChange type: ${type}`);
        }
      }
      _trzs.push(trz);
    }
    setRecognizedTransactions(_trzs);
  };

  const getTransactions = async (text) => {
    result = await GPTTransactions(dispatch, text);
    // console.log(result);
    let _trzs = [];
    for (let i = 0; i < result.length; i++) {
      if (!result[i].summ) {
        continue;
      }
      const exin_item = exInItems.find(
        (item) => item.name == result[i].expense_item
      );
      let wallet = undefined;
      if (result[i].wallet) {
        wallet = wallets.find((item) => item.name == result[i].wallet);
      } else {
        wallet = wallets.find((item) => item.id == 2);
      }
      const trz = {
        exin_item: exin_item,
        wallet: wallet,
        summ: result[i].summ,
        comment: result[i].comment ? result[i].comment : "",
      };
      _trzs.push(trz);
    }

    setRecognizedTransactions(_trzs);
    scrollToBottom();
  };

  const appendTransactions = async () => {
    if (isEmpty(recognized_transactions)) {
      return;
    }

    const user = JSON.parse(await SecureStore.getItemAsync("user"));
    let new_transactions = await getData("transactions");
    let wallets = await getData("wallets");
    for (let i = 0; i < recognized_transactions.length; i++) {
      const summ = parseFloat(recognized_transactions[i].summ) * -1;
      const comment = recognized_transactions[i].comment;
      const wallet = recognized_transactions[i].wallet;
      const exin_item = recognized_transactions[i].exin_item;
      payload = {
        wallet1: wallet,
        wallet2: null,
        exInItem: exin_item,
        amount1: summ.toString(),
        amountARS1: (
          summ * getRate(wallet.currency.name, "ARS", symbols)
        ).toString(),
        amountUSD1: (
          summ * getRate(wallet.currency.name, "USD", symbols)
        ).toString(),
        amountBTC1: (
          summ * getRate(wallet.currency.name, "BTC", symbols)
        ).toString(),
        amountETH1: (
          summ * getRate(wallet.currency.name, "ETH", symbols)
        ).toString(),
        amountRUB1: (
          summ * getRate(wallet.currency.name, "RUB", symbols)
        ).toString(),
        amount2: null,
        amountARS2: null,
        amountUSD2: null,
        amountBTC2: null,
        amountETH2: null,
        amountRUB2: null,
        comment: comment,
        date: Date.now(),
        doc_id: Date.now() + i,
        user: user,
        new: true,
        modified: true,
        deleted: false,
      };
      new_transactions.push(payload);

      // update wallets
      wallets.forEach((item) => {
        if (item.id === wallet.id)
          item.balance = (parseFloat(item.balance) + summ).toString();
      });
    }

    storeData("transactions", new_transactions);
    storeData("wallets", wallets);
    dispatch(setTransactions(new_transactions));
    dispatch(setWallets(wallets));

    navigation.navigate("Tabs");
  };

  // transcription got
  useEffect(() => {
    if (recognizedText) {
      // console.log("transcription: ", recognizedText);
      getTransactions(
        // "каррифур 22 тысячи, овощной 5000 и еще купил сигареты, корректировка 3467"
        recognizedText
      );
      dispatch(setRecognizedText(""));
    }
  }, [recognizedText]);

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Значение смещения может потребовать настройки
      style={styles.container}
    >
      {/* # header */}
      <View style={styles.header}>
        {recognized_transactions && (
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
            Распознанные транзакции:
          </Text>
        )}
      </View>

      {/* # body */}
      {recognized_transactions && (
        <View style={styles.body}>
          <ScrollView ref={scrollViewRef} style={{ width: "100%" }}>
            {recognized_transactions.map((item, index) => (
              <Transaction
                key={Date.now() + index}
                index={index}
                wallet={item.wallet.name}
                exin_item={item.exin_item.name}
                summ={item.summ}
                comment={item.comment}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </ScrollView>

          <AddButton onPress={appendTransactions} style={{ marginTop: 20 }} />
        </View>
      )}

      {!recognized_transactions && (
        <View style={styles.body}>
          <Text style={{ color: blueColor, fontSize: 24, fontWeight: "600" }}>
            Продиктуйте список покупок.
          </Text>
          <Text
            style={{
              color: blueColor,
              fontSize: 22,
              fontWeight: "600",
              marginTop: 10,
            }}
          >
            Например:
          </Text>
          <Text
            style={{
              color: "#fff",
              marginHorizontal: 50,
              marginTop: 10,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Каррифур 23567, овощи 5500, хлебный 1700 и в аптеке еще 9000.
          </Text>
        </View>
      )}

      {/* # footer */}
      <View style={styles.footer}>
        <CircleButton onPress={onStartRecording} />
      </View>

      <BackBtn
        style={styles.backBtn}
        onPress={() => navigation.navigate("Tabs")}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
  },
  header: {
    justifyContent: "center",
    height: "5%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 7,
    right: 10,
  },
});

export default AIAddScreen;
