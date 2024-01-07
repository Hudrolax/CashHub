import { StyleSheet, View } from "react-native";

import Wallets from "./Wallets";
import ExInItems from "./ExInItems";
import Dates from "./Dates";


export default function ScrollColumns() {
    return (
      <View style={styles.container}>
        <Wallets/>
        <View style={styles.separator} />
        <ExInItems/>
        <View style={styles.separator} />
        <Dates/>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#181715",
  },
  separator: {
    width: 1, // or '100%' for a horizontal separator
    backgroundColor: 'gray', // Color of the separator
    // Add padding or margin if you want space around the separator
  },
});
