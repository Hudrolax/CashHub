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
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  isEmpty,
  formatNumberLight,
  getRate,
  formatDateShort,
  formatDate,
  addCurrencySymbol,
  showAlert,
} from "../util";
import { greenColor } from "../colors";
import { dispatchedFetchRequest, fetchHomeData } from "../dataUpdater";

const getDisplayFontSize = (_expression) => {
  if (_expression.length > 21) {
    return 16
  } else if (_expression.length > 16) {
    return 19
  } else if (_expression.length > 10) {
    return 22
  } else {
    return 32
  }
}

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
    } else if (trz || isEmpty(wallet2)) {
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

  const exchangeMode = !isEmpty(wallet2);

  const handlePress = (value) => {
    Vibration.vibrate(2);

    switch (activeField) {
      case "display1":
        try {
          setExpression((prev) => prev + value);
          setExpression2((expression + value) * rate);
        } catch {}
        break;
      case "display2":
        try {
          setExpression2((prev) => prev + value);
          setExpression((expression2 + value) / rate);
        } catch {}
        break;
      case "rate":
        try {
          setRate((prev) => prev + value);
          setExpression2(expression * (rate + value));
        } catch {}
        break;
    }
  };

  const handleResult = () => {
    try {
      Vibration.vibrate(2);
      switch (activeField) {
        case "display1":
          setExpression(eval(expression));
          setExpression2(eval(expression) * rate);
          break;
        case "display2":
          setExpression2(eval(expression2));
          setExpression(eval(expression2) / rate);
          break;
      }
      return true;
    } catch (e) {
      Vibration.vibrate(50);
      setExpression("Error");
      return false;
    }
  };

  const handleDelete = () => {
    Vibration.vibrate(2);
    setExpression("");
    if (exchangeMode) {
      setExpression2("");
    }
  };

  const handleDelete2 = () => {
    Vibration.vibrate(2);
    setExpression("");
    if (exchangeMode) {
      setExpression2("");
    }
  };

  const handleDeleteRate = () => {
    Vibration.vibrate(2);
    setRate("");
    handleResult();
  };

  const handleOk = async () => {
    Vibration.vibrate(10);
    let _rate = rate;
    let _expression = expression;
    try {
      _expression = eval(_expression);
    } catch {
      showAlert('Ошибка:', 'Ошибка в выражении суммы!', 'Ok')
      return
    }

    if (exchangeMode) {
      try {
        _rate = eval(_rate);
      } catch {
        showAlert('Ошибка:', 'Ошибка в обменном курсе!', 'Ok')
        return
      }
    }

    // console.log(eval(expression).toString());
    // console.log(JSON.stringify(pressedDate, null, 2));

    if (!exchangeMode) {
      payload = {
        wallet_from_id: wallet1.id,
        wallet_to_id: null,
        exchange_rate: null,
        exin_item_id: exInItem.id,
        amount: (exInItem.income ? "" : "-") + _expression,
        comment: comment,
      };
    } else {
      payload = {
        wallet_from_id: wallet1.id,
        wallet_to_id: wallet2.id,
        exchange_rate: _rate,
        exin_item_id: null,
        amount: _expression,
        comment: comment,
      };
    }
    if (date.title !== "Сегодня") {
      payload.date = date.date;
    }
    if (trz) {
      dispatch(
        dispatchedFetchRequest(
          token,
          payload,
          `/wallet_transactions/${trz.doc_id}`,
          "PUT"
        )
      );
    } else {
      dispatch(
        dispatchedFetchRequest(token, payload, "/wallet_transactions/", "POST")
      );
    }

    dispatch(fetchHomeData(token))

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
    if (Platform.OS === "ios") {
      return {
        flex: !exchangeMode ? 1 : 1.2,
        backgroundColor: "black",
      };
    } else {
      return keyboardVisible
        ? { backgroundColor: "black" }
        : {
            flex: !exchangeMode ? 1 : 1.2,
            backgroundColor: "black",
          };
    }
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
    let style = styles.displayText
    if (activeField === display) {
      style = { ...style, textDecorationLine: "underline" };
    }
    if (display === 'display1' && expression) {
      style = {...style, fontSize: getDisplayFontSize(expression.toString())}
    } else if (expression2) {
      style = {...style, fontSize: getDisplayFontSize(expression2.toString())}
    }

    return style
  };

  const rateDisplayStyle = () => {
    let style = {color: "black", fontSize: 18}
    if (activeField === "rate") {
      style = { ...style, textDecorationLine: "underline" };
    }  

    if (rate && rate.toString().length > 7) {
      style = {...style, fontSize: 12}
    } else if (rate && rate.toString().length > 5) {
      style = {...style, fontSize: 16}
    }
    return style
  };

  if (isEmpty(wallet1)) return null;

  return (
    <View style={getDynamicStyles()}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#041515",
          // borderBottomWidth: 2,
          borderTopWidth: 1,
          borderColor: "#797979",
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
          <Text style={{ fontSize: 10 }}>✖️</Text>
        </TouchableOpacity>
      </View>

      {(!keyboardVisible || Platform.OS === "ios") && (
        <View style={{ flex: 1 }}>
          {exchangeMode ? (
            <View style={{ flex: 1 }}>
              {/* first display */}
              <TouchableWithoutFeedback
                onPress={() => setActiveField("display1")}
              >
                <View style={displayStyle()}>
                  <Text style={displayTextStyle("display1")}>
                    {addCurrencySymbol(expression, wallet1.currency.name)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete();
                      setActiveField("display1");
                    }}
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
                    <Text style={rateDisplayStyle()}>
                      {rate ? formatNumberLight(rate) : ""}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleDeleteRate();
                        setActiveField("rate");
                      }}
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
                    {addCurrencySymbol(expression2, wallet2.currency.name)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete2();
                      setActiveField("display2");
                    }}
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
              <Text style={displayTextStyle("display1")}>
                {addCurrencySymbol(expression, wallet1.currency.name)}
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
    height: 50,
    width: "90%",
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
