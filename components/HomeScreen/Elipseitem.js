import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ElipseItem = ({ title, itemColor, onPress, onLongPress }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.circle, { backgroundColor: itemColor }]}
      >
        <Text style={styles.circleText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    marginVertical: 10, // Adjust as needed for spacing
  },
  circleText: {
    fontSize: 16, // Adjust your font size
    color: "#fff", // Adjust your color
    marginBottom: 5, // Space between title and circle
  },
  circle: {
    width: 110, // Adjust the size of the circle
    height: 30, // Adjust the size of the circle
    borderRadius: 30, // Half of width/height to make it a perfect circle
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ElipseItem;
