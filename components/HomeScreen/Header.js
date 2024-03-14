import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";

import HamburgerMenu from "../MenuBtn/MenuBtn";
import { getRate, formatNumber } from "../util";
import AIAddBtn from "./AIAddBtn";

const Header = ({ navigation, style }) => {
  const user = useSelector((state) => state.login_screen.user);
  const wallets = useSelector((state) => state.mainState.wallets);
  const symbols = useSelector((state) => state.mainState.symbols);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);

  const countTotalBalance = (wallets) => {
    let totalBalance = 0;
    wallets.map((item) => {
      const rate = getRate(item.currency.name, mainCurrency, symbols);
      totalBalance += item.balance * rate;
    });
    return totalBalance;
  };

  const totalBalance = countTotalBalance(wallets);

  const onAIAdd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    navigation.navigate("AIAddScreen")
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      <HamburgerMenu navigation={navigation} style={styles.hamburger} />

      {/* top */}
      <View style={styles.top}>
        <Text style={styles.username}>{user ? user.name : ""}</Text>
        <Text style={styles.totalBalance}>
          {formatNumber(totalBalance, mainCurrency)}
        </Text>
      </View>

      {/* bottom */}
      <View styles={styles.bottom}>{/* <Text style={{}}>Header</Text> */}</View>
      <AIAddBtn style={styles.AIBtn} onPress={onAIAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  hamburger: {
    position: "absolute",
    top: "8%",
    left: "3%",
    zIndex: 3000,
  },
  top: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "7%",
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    color: "#fff",
  },
  totalBalance: {
    fontSize: 32,
    color: "#fff",
  },
  AIBtn: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
});

export default Header;
