import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const DropList = ({ style, hint, value, options, setValue }) => {
  //   const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = async (option) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <View style={{ ...styles.container, ...style, zIndex: isOpen ? 999 : 0 }}>
      <Text style={styles.fieldHint}>{hint}</Text>
      <TouchableOpacity onPress={toggleDropdown} style={styles.field}>
        <Text style={styles.fieldInput}>{value}</Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          🔽
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
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: 200,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  fieldHint: {
    color: "grey",
  },
  fieldInput: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 3,
  },
  dropdown: {
    backgroundColor: "#242424",
    borderColor: "grey",
    borderWidth: 1,
    position: "absolute",
    top: 80,
    zIndex: 999,
    width: 200,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
