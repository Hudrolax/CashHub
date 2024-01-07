import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const HamburgerMenu = ({ navigation, style }) => {
  return (
    <View style={{...styles.menuContainer, ...style}}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={styles.container}
      >
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
  },
  container: {
    width: 35, // Width of the hamburger icon
    height: 25, // Height of the hamburger icon
    justifyContent: "space-between",
    flexDirection: "column",
    padding: 5,
  },
  line: {
    height: 3, // Height of each line
    backgroundColor: "#fff", // Color of the lines
    borderRadius: 3, // Optional: if you want rounded lines
  },
});

export default HamburgerMenu;
