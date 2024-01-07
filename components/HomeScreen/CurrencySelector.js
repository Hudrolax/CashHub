import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";

import { setMainCurrency } from "../actions";
import { greenColor } from "../colors";

const CurrencySelector = ({ style }) => {
  const dispatch = useDispatch();
  const mainCurrency = useSelector((state) => state.mainState.mainCurrency);
  const currencies = useSelector((state) => state.mainState.currencies);
  const [isOpen, setIsOpen] = useState(false);

  const options = currencies.map((item) => item.name);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = async (option) => {
    await SecureStore.setItemAsync("mainCurrency", option);
    dispatch(setMainCurrency(option));
    setIsOpen(false);
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
        <Text style={{ color: greenColor, fontSize: 16, fontWeight: "bold" }}>
          {mainCurrency}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectOption(option)}
              style={styles.option}
            >
              <Text style={{ color: "#fff" }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    // width: 200,
    // alignSelf: 'center',
  },
  button: {
    // padding: 10,
    // backgroundColor: '#dddddd',
    height: 30,
    width: 50,
    borderWidth: 1,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#181715",
    borderColor: greenColor,
    borderWidth: 1,
    position: "absolute",
    top: 40,
    zIndex: 3000,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: greenColor,
  },
});

export default CurrencySelector;
