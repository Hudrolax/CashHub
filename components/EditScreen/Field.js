import {
    View,
    Text,
    StyleSheet,
    TextInput,
  } from "react-native";

export const Field = ({ hint, value, setValue, style, isActive=true, keyboardType }) => {
  return (
    <View style={{...styles.field, ...style}}>
      <Text style={styles.fieldHint}>{hint}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => setValue(text)}
        editable={isActive}
        keyboardType={keyboardType}
        style={styles.fieldInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
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
});