import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { setMainCurrency } from "../actions";
import { greenColor } from "../colors";
import { storeData } from "../data";
import { backendRequest, currencies_endpoint } from "../requests";

const CurrencySelector = ({ style }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const [isOpen, setIsOpen] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const result = await backendRequest({
            dispatch,
            token,
            endpoint: currencies_endpoint,
            method: "GET",
            throwError: true,
          });
          setCurrencies(result)
        } catch (e) {
          console.error(`Не удалось загрузить валюты: ${e.message}`);
        }
      };

      loadData();

      return () => {};
    }, [token])
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = async (option) => {
    await storeData("mainCurrency", option);
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
          {currencies.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => selectOption(item.name)}
              style={styles.option}
            >
              <Text style={{ color: "#fff" }}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
  },
  button: {
    height: 30,
    width: "100%",
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
    width: "100%",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: greenColor,
  },
});

export default CurrencySelector;
