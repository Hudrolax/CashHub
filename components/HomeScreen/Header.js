import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import HamburgerMenu from "../MenuBtn/MenuBtn";
import { getRate, formatNumber } from "../util";
import CurrencySelector from "./CurrencySelector";

const Header = ({ navigation, style }) => {
  const username = useSelector((state) => state.login_screen.username);
  const wallets = useSelector((state) => state.mainState.wallets);
  const symbols = useSelector((state) => state.mainState.symbols);
  const mainCurrency = useSelector((state) => state.mainState.mainCurrency);

  const countTotalBalance = (wallets) => {
    let totalBalance = 0;
    wallets.map((item) => {
      const rate = getRate(item.currency.name, mainCurrency, symbols);
      totalBalance += parseFloat(item.balance) * rate;
    });
    return totalBalance
  };

  const totalBalance = countTotalBalance(wallets);

  return (
    <View style={{ ...styles.container, ...style }}>
      <HamburgerMenu navigation={navigation} style={styles.hamburger}/>
      <CurrencySelector style={styles.currencySelector}/>

      {/* top */}
      <View style={styles.top}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.totalBalance}>
          {formatNumber(totalBalance, mainCurrency, true)}
        </Text>
      </View>

      {/* bottom */}
      <View styles={styles.bottom}>
        {/* <Text style={{}}>Header</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#1f1e1b",
  },
  currencySelector: {
    position: "absolute",
    top: '8%',
    right: '3%',
  },
  hamburger: {
    position: "absolute",
    top: '8%',
    left: '3%',
    zIndex: 3000,
  },
  top: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "center",
    marginTop: '7%'
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
});

export default Header;
