import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import CrossButton from "./CrossBtn";

export const DropList = ({ style, value, options, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.field}>
        <Text style={styles.fieldInput}>{value}</Text>
        <Text style={styles.dropdownIcon}>🔽</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalView}>
          {options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => selectOption(option)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <CrossButton style={styles.closeBtn} onPress={() => setIsOpen(false)}/>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  modalView: {
    position: "absolute", // Абсолютное позиционирование
    bottom: 0, // Прижимаем к нижнему краю
    width: "100%", // Занимаем всю ширину экрана
    marginTop: 50, // Настройте это значение в соответствии с вашим интерфейсом
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionText: {
    color: "#000", // Настройте цвет в соответствии с вашим дизайном
  },
  dropdownIcon: {
    paddingBottom: 4,
    marginLeft: 6,
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginHorizontal: 5,
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
    zIndex: 9999,
    width: 200,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
