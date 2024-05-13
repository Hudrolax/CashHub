import { View, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

function NewItem({ style, onComplete }) {
  const [text, setText] = useState("")

  return (
    <View style={{ ...styles.container, ...style }}>
      <TextInput
        style={styles.input}
        placeholder="Что купить?"
        placeholderTextColor="grey"
        value={text}
        onChangeText={(text) => setText(text)}
        autoFocus={true}
        onSubmitEditing={() => onComplete(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "95%",
  },
  input: {color: "yellow", fontSize: 18}
});

export default NewItem;
