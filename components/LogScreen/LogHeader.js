import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LimitBtn = ({ style, item, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, borderColor: item.active ? "green" : 'grey' }}
      onPress={() => onPress(item)}
    >
      <Text style={styles.buttonText}>{item.limit}</Text>
    </TouchableOpacity>
  );
};

const LogHeader = ({ style, onSetLimit }) => {
  const [btns, setBtns] = useState([
    { limit: 30, active: true },
    { limit: 50, active: false },
    { limit: 100, active: false },
    { limit: 1000, active: false },
  ]);

  const onPressBtn = (item) => {
    const _btns = [...btns.map(btn => ({...btn, active: btn.limit === item.limit ? true : false}))]
    setBtns(_btns)
    onSetLimit(item.limit)
  }

  return (
    <View style={{ ...styles.container, style }}>
      {btns.map((item) => (
        <LimitBtn key={item.limit} item={item} onPress={onPressBtn}/>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 55,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 3,
    marginHorizontal: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
  },
});

export default LogHeader;
