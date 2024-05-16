import React, { useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

const SearchLine = ({ style, text, onChange }) => {

  return (
    <View style={{ ...styles.container, ...style }}>
      <TextInput
        style={styles.input}
        placeholder="Фильтр..."
        placeholderTextColor="grey"
        value={text}
        onChangeText={(text) => onChange(text)}
        autoFocus={true}
        // onSubmitEditing={() => onComplete(text)}
      />

      {text && (
        <TouchableOpacity onPress={() => onChange("")}>
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    maxWidth: "70%",
  },
  input: {
    color: "#fff",
    width: "100%",
  },
});

export default SearchLine;
