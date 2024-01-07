import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Vibration,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import isEmptyObject, {
  formatNumber,
  getRate,
  formatDateShort,
  formatDate,
} from "../util";
import { fetchRequest } from "./actions";
import { greenColor } from "../colors";

export default function Calculator({ navigation, trz }) {
  const dispatch = useDispatch();
  const pressedWallet1 = useSelector((state) => state.mainState.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.mainState.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.mainState.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.mainState.pressedDate);
  const symbols = useSelector((state) => state.mainState.symbols);
  const token = useSelector((state) => state.login_screen.token);

  const wallet1 = trz ? trz.wallet1 : pressedWallet1;
  const wallet2 = trz ? trz.wallet2 : pressedWallet2;
  const exInItem = trz ? trz.exInItem : pressedExInItem;
  const date = trz
    ? {
        id: 1,
        text: formatDateShort(new Date(trz.date)),
        title: formatDate(trz.date),
        date: trz.date,
      }
    : pressedDate;

  const [expression, setExpression] = useState(
    trz ? (trz.amount1[0] === "-" ? trz.amount1.slice(1) : trz.amount1) : ""
  );
  const [expression2, setExpression2] = useState(trz ? trz.amount2 : "");

  const pickRate = () => {
    if (trz && trz.wallet2) {
      return Math.abs(trz.amount2 / trz.amount1);
    } else if (trz) {
      return 1;
    } else {
      return getRate(wallet1.currency.name, wallet2.currency.name, symbols);
    }
  };

  const [rate, setRate] = useState(pickRate());
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isEvalFine, setIsEvalFine] = useState(false);
  const [comment, setComment] = useState(trz ? trz.comment : "");
  const [activeField, setActiveField] = useState("display1");

  const exchangeMode = !isEmptyObject(pressedWallet2) || (trz && trz.wallet2);

  const handlePress = (value) => {
    Vibration.vibrate(2);

    switch (activeField) {
      case "display1":
        try {
          setExpression((prev) => prev + value);
          setExpression2(
            formatNumber((expression + value) * rate),
            wallet1.currency.name
          );
        } catch {}
        break;
      case "display2":
        try {
          setExpression2((prev) => prev + value);
          setExpression(
            formatNumber((expression2 + value) / rate),
            wallet2.currency.name
          );
        } catch {}
        break;
      case "rate":
        try {
          setRate((prev) => prev + value);
          setExpression2(formatNumber(expression * (rate + value)), undefined);
        } catch {}
        break;
    }
  };

  const handleResult = () => {
    try {
      Vibration.vibrate(2);
      switch (activeField) {
        case "display1":
          setExpression(eval(expression).toString());
          setExpression2(
            formatNumber(eval(expression) * rate),
            wallet1.currency.name
          );
          break;
        case "display2":
          setExpression2(eval(expression2).toString());
          setExpression(
            formatNumber(eval(expression2) / rate),
            wallet2.currency.name
          );
          break;
      }
      return true;
    } catch (e) {
      Vibration.vibrate(50);
      setExpression("Error");
      return false;
    }
  };

  const handleDelete = (long) => {
    Vibration.vibrate(2);
    try {
      if (long) {
        setExpression("");
        if (exchangeMode) {
          setExpression2("");
        }
      } else {
        setExpression((prev) => prev.slice(0, -1));
        if (exchangeMode) {
          setExpression2(
            formatNumber(eval(expression.slice(0, -1)) * rate),
            wallet2.currency.name
          );
        }
      }
    } catch {}
  };

  const handleDelete2 = (long) => {
    Vibration.vibrate(2);
    try {
      if (long) {
        setExpression("");
        if (exchangeMode) {
          setExpression2("");
        }
      } else {
        setExpression2((prev) => prev.slice(0, -1));
        if (exchangeMode) {
          setExpression(
            formatNumber(eval(expression2.slice(0, -1)) / rate),
            wallet1.currency.name
          );
        }
      }
    } catch {}
  };

  const handleDeleteRate = () => {
    Vibration.vibrate(2);
    setRate("");
    setExpression2("");
    setActiveField("rate");
  };

  const handleOk = async () => {
    if (!handleResult()) return;
    Vibration.vibrate(10);

    // console.log(eval(expression).toString());
    // console.log(JSON.stringify(pressedDate, null, 2));

    if (!exchangeMode) {
      payload = {
        wallet_from_id: wallet1.id,
        wallet_to_id: null,
        exchange_rate: null,
        exin_item_id: exInItem.id,
        amount: (exInItem.income ? "" : "-") + expression,
        comment: comment,
      };
    } else {
      payload = {
        wallet_from_id: wallet1.id,
        wallet_to_id: wallet2.id,
        exchange_rate: rate,
        exin_item_id: null,
        amount: expression,
        comment: comment,
      };
    }
    if (date.title !== "Сегодня") {
      payload.date = date.date;
    }
    if (trz) {
      dispatch(
        fetchRequest(
          token,
          payload,
          `/wallet_transactions/${trz.doc_id}`,
          "PUT"
        )
      );
    } else {
      dispatch(fetchRequest(token, payload, "/wallet_transactions/", "POST"));
    }

    navigation.navigate("Tabs");
  };

  useEffect(() => {
    try {
      eval(expression);
      if (expression === "") throw new Error();
      setIsEvalFine(true);
    } catch {
      setIsEvalFine(false);
    }
  }, [expression]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getDynamicStyles = () => {
    return keyboardVisible
      ? { backgroundColor: "black" }
      : {
          flex: !exchangeMode ? 1 : 1.2,
          backgroundColor: "black",
        };
  };

  const buttonsStyle = () => {
    return !exchangeMode ? styles.buttons : { ...styles.buttons, flex: 3 };
  };

  const displayStyle = () => {
    return !exchangeMode
      ? styles.display
      : { ...styles.display, marginVertical: 0 };
  };

  const displayTextStyle = (display) => {
    if (activeField === display) {
      return { ...styles.displayText, textDecorationLine: "underline" };
    } else {
      return styles.displayText;
    }
  };

  const rateDisplayStyle = () => {
    if (activeField === "rate") {
      return { color: "black", fontSize: 18, textDecorationLine: "underline" };
    } else {
      return { color: "black", fontSize: 18 };
    }
  };

  return (
    <View style={getDynamicStyles()}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 2,
          borderColor: "#fff",
        }}
      >
        <TextInput
          style={styles.commentInput}
          placeholder="Комментарий"
          placeholderTextColor="grey"
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <TouchableOpacity
          onPress={() => setComment("")}
          style={{ marginHorizontal: 10 }}
        >
          <Text style={{ color: "black", fontSize: 10 }}>✖️</Text>
        </TouchableOpacity>
      </View>

      {!keyboardVisible && (
        <View style={{ flex: 1 }}>
          {exchangeMode ? (
            <View style={{ flex: 1 }}>
              {/* first display */}
              <TouchableWithoutFeedback
                onPress={() => setActiveField("display1")}
              >
                <View style={displayStyle()}>
                  <Text style={displayTextStyle("display1")}>
                    {formatNumber(expression, wallet1.currency.name, true)}
                  </Text>
                  <TouchableOpacity
                    onPress={handleDelete}
                    onLongPress={() => handleDelete(true)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>⌫</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>

              {/* rate display */}
              <View style={{ height: 1, backgroundColor: "black" }} />

              <TouchableWithoutFeedback onPress={() => setActiveField("rate")}>
                <View style={styles.convertDisplay}>
                  <View style={styles.convertDisplayBorder}>
                    <Text style={rateDisplayStyle()}>{rate}</Text>
                    <TouchableOpacity
                      onPress={handleDeleteRate}
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Text style={{ color: "black", fontSize: 10 }}>✖️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* second display */}
              <TouchableWithoutFeedback
                onPress={() => setActiveField("display2")}
              >
                <View style={displayStyle()}>
                  <Text style={displayTextStyle("display2")}>
                    {formatNumber(expression2, wallet2.currency.name, true)}
                  </Text>
                  <TouchableOpacity
                    onPress={handleDelete2}
                    onLongPress={() => handleDelete2(true)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>⌫</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            // one display variante
            <View style={styles.display}>
              <Text style={styles.displayText}>
                {formatNumber(expression, wallet1.currency.name, true)}
              </Text>
              <TouchableOpacity
                onPress={handleDelete}
                onLongPress={() => handleDelete(true)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>⌫</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={buttonsStyle()}>
            {[
              "7",
              "8",
              "9",
              "-",
              "4",
              "5",
              "6",
              "+",
              "1",
              "2",
              "3",
              "*",
              ".",
              "0",
              "=",
              "/",
            ].map((value) => {
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() =>
                    value === "=" ? handleResult() : handlePress(value)
                  }
                  style={
                    value === "=" && !isEvalFine
                      ? styles.buttonInactive
                      : styles.button
                  }
                  disabled={value === "=" && !isEvalFine}
                >
                  <Text style={styles.buttonText}>{value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={handleOk}
              style={!isEvalFine ? styles.okButtonInactive : styles.okButton}
              disabled={!isEvalFine}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  commentInput: {
    color: "#fff",
    fontSize: 18,
    height: 40,
  },
  convertDisplay: {
    position: "absolute",
    justifyContent: "center",
    top: 0,
    bottom: 0,
    zIndex: 12,
  },
  convertDisplayBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "grey",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 2,
    alignItems: "center",
    marginHorizontal: "3%",
    minWidth: "20%",
  },
  display: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: greenColor,
    justifyContent: "flex-end",
    marginVertical: 1,
  },
  displayText: {
    color: "white",
    fontSize: 32,
    textAlign: "right",
    marginHorizontal: "5%",
  },
  buttons: {
    flex: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    width: "90%",
    marginHorizontal: "10%",
  },
  cancelButton: {
    marginHorizontal: "1%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 32,
  },
  button: {
    width: "23%", // adjust the width as necessary
    height: "23%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    margin: "1%",
    // borderRadius: 10,
  },
  buttonInactive: {
    width: "23%", // adjust the width as necessary
    height: "23%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#808080",
    margin: "1%",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  okButton: {
    backgroundColor: greenColor,
    marginTop: 20,
    marginHorizontal: 10,
    minWidth: 80,
  },
  okButtonInactive: {
    backgroundColor: "#808080",
    marginTop: 20,
    marginHorizontal: 10,
    minWidth: 80,
  },
  okButtonText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
});
