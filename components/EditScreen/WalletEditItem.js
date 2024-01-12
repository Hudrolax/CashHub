import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { DropList } from "./DropList";
import { Field } from "./Field";
import { OkBtn } from "./OkBtn";

export const WalletEditItem = ({ wallet, style, onOk }) => {
  const currencies = useSelector((state) => state.mainState.currencies);
  const [walletName, setWalletName] = useState(wallet.name);
  const [currencyName, setCurrencyName] = useState(wallet.currency.name);
  const [balance, setBalance] = useState(wallet.balance);

  return (
    <View style={{...styles.body, ...style}}>
      <Field
        hint={"Имя:"}
        value={walletName}
        setValue={setWalletName}
        style={{ marginBottom: 20 }}
      />

      <DropList
        hint={"Валюта:"}
        value={currencyName}
        options={currencies.map((i) => i.name)}
        setValue={setCurrencyName}
        style={{ marginBottom: 20 }}
      />

      <Field
        hint={"Остаток:"}
        value={balance}
        setValue={setBalance}
        style={{ marginBottom: 20 }}
        isActive={false}
        keyboardType={"numeric"}
      />

      <OkBtn
        isActive={true}
        text={"Ok"}
        onPress={() => onOk({id: wallet.id, name: walletName, currencyName: currencyName, balance: balance})}
        style={{ marginTop: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
});
