import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { setTrzLimit } from "../actions";
import { getPastDate } from "../util";

const LimitBtn = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, borderColor: item.active ? "green" : 'grey' }}
      onPress={() => onPress(item)}
    >
      <Text style={styles.buttonText}>{item.limit}</Text>
    </TouchableOpacity>
  );
};

const LogHeader = ({ style }) => {
  const dispatch = useDispatch();

  let _btns = [
    { limit: 'Неделя', active: true},
    { limit: 'Месяц', active: false},
    { limit: 'Год', active: false},
  ]
  _btns.forEach(btn => btn.date = getPastDate(btn.limit))
  const [btns, setBtns] = useState(_btns);

  const onPressBtn = (item) => {
    const _btns = [...btns.map(btn => ({...btn, active: btn.limit === item.limit ? true : false}))]
    setBtns(_btns)
    dispatch(setTrzLimit(item.date))
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
    width: 70,
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
    fontSize: 16,
  },
});

export default LogHeader;
