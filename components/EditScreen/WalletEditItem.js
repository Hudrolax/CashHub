import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { orangeColor } from "../colors";
import TrashLogo from "./trash.svg";
import { DropList } from "./DropList";

const Field = ({hint, value, setValue}) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldHint}>{hint}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => setValue(text)}
        style={styles.fieldInput}
      />
    </View>
  );
};

export const WalletEditItem = ({ wallet }) => {
  const currencies = useSelector((state) => state.mainState.currencies);
  const [walletName, setWalletName] = useState(wallet.name);
  const [currencyName, setCurrencyName] = useState(wallet.currency.name);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20 }}>
          Редактирование счета
        </Text>
        <TouchableOpacity style={{ marginRight: 10 }}>
          <TrashLogo height={38} width={38} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Field hint={'Имя:'} value={walletName} setValue={setWalletName}/>
        <DropList value={currencyName} options={currencies.map((i) => i.name)} setValue={setCurrencyName}/>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 40,
    backgroundColor: orangeColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  field: {
    minWidth: 200,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  fieldHint: {
    color: "grey",
    alignItems: "flex-end",
  },
  fieldInput: {
    color: "#fff",
    fontSize: 18,
    height: 40,
  },
  body: {
    flex: 1,
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: 40,
    backgroundColor: "#424858",
  },
});
