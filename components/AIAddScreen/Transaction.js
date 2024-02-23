import { View, StyleSheet, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { blueColor } from "../colors";
import { DropList } from "./DropList";
import { useSelector } from "react-redux";
import CrossButton from "./CrossBtn";

function Transaction({
  style,
  index,
  exin_item,
  summ,
  comment,
  wallet,
  onChange,
  onDelete,
}) {
  const [text_summ, setSumm] = useState(`${summ}`);
  const [text_comment, setComment] = useState(comment);
  const exInItems = useSelector((state) => state.mainState.exInItems);
  const wallets = useSelector((state) => state.mainState.wallets);

  return (
    <View style={{ ...styles.container, ...style }}>
      {/* ExInItem */}
      <View style={{ ...styles.element, flexDirection: "row" }}>
        <Text style={styles.label}>Статья:</Text>
        <DropList
          index={index}
          value={exin_item}
          options={exInItems.filter((i) => !i.income).map((i) => i.name)}
          setValue={(value) => onChange(index, "exin_item", value)}
        />
      </View>

      {/* summ */}
      <View style={{ ...styles.element, flexDirection: "row" }}>
        <Text style={styles.label}>Сумма:</Text>
        <TextInput
          style={{ ...styles.text, marginLeft: 5, minWidth: 100 }}
          placeholder="Сумма"
          placeholderTextColor="grey"
          value={text_summ}
          onChangeText={(text) => setSumm(text)}
          keyboardType="numeric"
          onEndEditing={(e) => onChange(index, "summ", e.nativeEvent.text)}
        />
      </View>

      {/* comment */}
      <View style={{ ...styles.element, flexDirection: "row" }}>
        <Text style={styles.label}>Комментарий:</Text>
        <TextInput
          style={{ ...styles.text, marginLeft: 5, minWidth: 100 }}
          placeholder="Комментарий"
          placeholderTextColor="grey"
          value={text_comment}
          onChangeText={(text) => setComment(text)}
          onEndEditing={(e) => onChange(index, "comment", e.nativeEvent.text)}
        />
      </View>

      {/* Wallet */}
      <View style={{ ...styles.element, flexDirection: "row" }}>
        <Text style={styles.label}>Кошелек:</Text>
        <DropList
          index={index}
          value={wallet}
          options={wallets.map((i) => i.name)}
          setValue={(value) => onChange(index, "wallet", value)}
        />
      </View>

      <CrossButton
        style={{ position: "absolute", top: 2, right: 2 }}
        onPress={() => onDelete(index)}
        size={30}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1e1b",
    padding: 5,
    margin: 5,
    borderRadius: 1,
    borderColor: "grey",
  },
  element: {
    marginVertical: 3,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  label: {
    color: blueColor,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default Transaction;
