import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./Header";
import ScrollColumns from "./ScrollColumns";
import ScrollColumnHeader from "./ScrollColumnHeader";
import {
  backendRequest,
  wallets_endpoint,
  symbols_endpoint,
  currencies_endpoint,
  exin_items_endpoint,
} from "../requests";
import { setIsLoading, setHomeScreenData, setHomeScreenDataUpdateTime } from "../actions";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const homeScreenDataUpdateTime = useSelector(
    (state) => state.stateReducer.homeScreenDataUpdateTime
  );

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (homeScreenDataUpdateTime === -1) dispatch(setIsLoading(true));
        try {
          const results = await Promise.all([
            backendRequest({
              dispatch,
              token,
              endpoint: wallets_endpoint,
              method: "GET",
              throwError: true,
            }),
            backendRequest({
              dispatch,
              token,
              endpoint: symbols_endpoint,
              method: "GET",
              throwError: true,
            }),
            backendRequest({
              dispatch,
              token,
              endpoint: currencies_endpoint,
              method: "GET",
              throwError: true,
            }),
            backendRequest({
              dispatch,
              token,
              endpoint: exin_items_endpoint,
              method: "GET",
              throwError: true,
            }),
          ]);
          const _data = {
            wallets: results[0],
            symbols: results[1],
            currency: results[2],
            exInItems: results[3]
          };
          dispatch(setHomeScreenData(_data));
          dispatch(setHomeScreenDataUpdateTime(new Date()));
        } catch (e) {
          console.error(
            `Не удалось загрузить кошельки и символы: ${e.message}`
          );
        } finally {
          if (homeScreenDataUpdateTime === -1) dispatch(setIsLoading(false));
        }
      };

      if (new Date() - homeScreenDataUpdateTime > 10000) loadData();

      return () => {};
    }, [homeScreenDataUpdateTime])
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.5, backgroundColor: "#1f1e1b" }}>
        <Image
          source={require("../../assets/home_background.jpg")}
          style={styles.backgroudImage}
          resizeMode="cover"
        ></Image>
        <Header navigation={navigation} style={{ flex: 1 }} />
        <ScrollColumnHeader navigation={navigation} />
      </View>
      <ScrollColumns navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroudImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
});
