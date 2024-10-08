import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
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
import { backendRequest, wallet_transactions_endpoint } from "../requests";
import { setTrzUpdateTime, setHomeScreenDataUpdateTime } from "../actions";

const getDisplayFontSize = (_expression) => {
  if (_expression.length > 21) {
    return 16;
  } else if (_expression.length > 16) {
    return 19;
  } else if (_expression.length > 10) {
    return 22;
  } else {
    return 32;
  }
};

export default function Calculator({
  navigation,
  trz,
  pressedWallets,
  pressedExInItem,
  pressedDate,
}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const { symbols } = useSelector((state) => state.stateReducer.homeScreenData);

  const exchangeMode =
    (pressedWallets && pressedWallets.length > 1) ||
    (trz && !isEmpty(trz.wallet_to.id));
  const wallet_from = trz ? trz.wallet_from : pressedWallets[0];
  const wallet_to = trz
    ? trz.wallet_to
    : pressedWallets.length > 1 && pressedWallets[1];
  const exInItem = trz ? trz.exin_item : pressedExInItem;
  const isIncome = useSelector((state) => state.stateReducer.isIncome);
  const date = trz
    ? {
        id: 1,
        text: formatDateShort(new Date(trz.date)),
        title: formatDate(trz.date),
        date: trz.datetime,
      }
    : pressedDate;

  const [expression, setExpression] = useState(
    trz ? (trz.amount_from < 0 ? -trz.amount_from : trz.amount_from) : ""
  );
  const [expression2, setExpression2] = useState(trz ? trz.amount_to : "");
  const [okPressed, setOkPressed] = useState(false);

  const pickRate = () => {
    if (trz && trz.wallet_to.id) {
      return Math.abs(trz.amount_to / trz.amount_from);
    } else if (trz || isEmpty(wallet_to.id)) {
      return 1;
    } else {
      return getRate(
        wallet_from.currency.name,
        wallet_to.currency.name,
        symbols
      );
    }
  };

  const [rate, setRate] = useState(pickRate());
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isEvalFine, setIsEvalFine] = useState(false);
  const [comment, setComment] = useState(trz ? trz.comment : "");
  const [activeField, setActiveField] = useState("display1");

  const handlePress = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (activeField) {
      case "display1":
        try {
          setExpression((prev) => prev + value);
          setExpression2(eval(expression + value) * rate);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    switch (activeField) {
      case "display1":
        try {
          setExpression(eval(expression));
          setExpression2(eval(expression) * rate);
        } catch {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setExpression2("Error");
          return false;
        }
        break;
      case "display2":
        try {
          setExpression2(eval(expression2));
          setExpression(eval(expression2) / rate);
        } catch {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setExpression("Error");
          return false;
        }
        break;
    }
    return true;
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpression("");
    if (exchangeMode) {
      setExpression2("");
    }
  };

  const handleErase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // console.log("trz ", trz)
    // console.log("expression ", expression)
    setExpression(expression ? String(expression).slice(0, -1) : "");
    // console.log(expression)
  };

  const handleDeleteRate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRate("");
    handleResult();
  };

  const handleOk = async () => {
    setOkPressed(true);
    let _rate = rate;
    let _expression = expression;
    let _expression2 = expression2;
    try {
      _expression = eval(_expression);
    } catch {
      showAlert("Ошибка:", "Ошибка в выражении суммы!", "Ok");
      return;
    }

    if (exchangeMode) {
      try {
        _expression2 = eval(_expression2);
      } catch {
        showAlert("Ошибка:", "Ошибка в выражении суммы!", "Ok");
        return;
      }
      try {
        _rate = eval(_rate);
      } catch {
        showAlert("Ошибка:", "Ошибка в обменном курсе!", "Ok");
        return;
      }
    }

    let payload = {
      wallet_from_id: wallet_from.id,
      wallet_to_id: wallet_to ? wallet_to.id : null,
      exin_item_id: exInItem ? exInItem.id : null,
      amount:
        exchangeMode || (exInItem && isIncome)
          ? _expression
          : -_expression,
      exchange_rate: _rate,
      comment,
      date: date.date,
    };

    if (trz) {
      payload.doc_id = trz.doc_id;
      try {
        await backendRequest({
          dispatch,
          token,
          endpoint: wallet_transactions_endpoint + `/${trz.doc_id}`,
          method: "PUT",
          payload,
          throwError: true,
          showLoadingOvarlay: true,
        });
        dispatch(setTrzUpdateTime(null))
        dispatch(setHomeScreenDataUpdateTime(null))
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(
          "Ошибка",
          "Не удалось изменить транзакцию. Возможно нет интернета?"
        );
      }
    } else {
      try {
        await backendRequest({
          dispatch,
          token,
          endpoint: wallet_transactions_endpoint,
          method: "POST",
          payload,
          throwError: true,
          showLoadingOvarlay: true,
        });
        dispatch(setTrzUpdateTime(null))
        dispatch(setHomeScreenDataUpdateTime(null))
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(
          "Ошибка",
          "Не удалось добавить транзакцию. Возможно нет интернета?"
        );
      }
    }
    navigation.goBack();
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
    let style = styles.displayText;
    if (activeField === display) {
      style = { ...style, textDecorationLine: "underline" };
    }
    if (display === "display1" && expression) {
      style = { ...style, fontSize: getDisplayFontSize(expression.toString()) };
    } else if (expression2) {
      style = {
        ...style,
        fontSize: getDisplayFontSize(expression2.toString()),
      };
    }

    return style;
  };

  const rateDisplayStyle = () => {
    let style = { color: "black", fontSize: 18 };
    if (activeField === "rate") {
      style = { ...style, textDecorationLine: "underline" };
    }

    if (rate && rate.toString().length > 7) {
      style = { ...style, fontSize: 12 };
    } else if (rate && rate.toString().length > 5) {
      style = { ...style, fontSize: 16 };
    }
    return style;
  };

  return (
    <View style={getDynamicStyles()}>
      {/* ok btn */}
      <View
        style={{
          alignItems: "flex-end",
          height: 40,
          backgroundColor: "#181715",
        }}
      >
        <TouchableOpacity
          onPress={handleOk}
          style={!isEvalFine ? styles.okButtonInactive : styles.okButton}
          disabled={!isEvalFine || okPressed}
        >
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#041515",
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
                    {addCurrencySymbol(expression, wallet_from.currency.name)}
                  </Text>

                  {/* cancel btn */}
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
                    {addCurrencySymbol(expression2, wallet_to.currency.name)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete();
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
                {addCurrencySymbol(expression, wallet_from.currency.name)}
              </Text>
              <TouchableOpacity
                onPress={handleErase}
                onLongPress={handleDelete}
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
    width: 100,
    height: 30,
    borderRadius: 3,
  },
  okButtonInactive: {
    backgroundColor: "#808080",
    width: 100,
    height: 30,
    borderRadius: 3,
  },
  okButtonText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
});
