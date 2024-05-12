import React, { useCallback, useState } from "react";
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
} from "../requests";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const [data, setData] = useState({ wallets: [], symbols: [], currency: []});

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
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
          ]);
          const _data = { wallets: results[0], symbols: results[1], currency: results[2] };
          setData(_data);
        } catch (e) {
          console.error(
            `Не удалось загрузить кошельки и символы: ${e.message}`
          );
        }
      };

      loadData();

      return () => {};
    }, [token])
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.5, backgroundColor: "#1f1e1b" }}>
        <Image
          source={require("../../assets/home_background.jpg")}
          style={styles.backgroudImage}
          resizeMode="cover"
        ></Image>
        <Header
          navigation={navigation}
          style={{ flex: 1 }}
          data={data}
        />
        <ScrollColumnHeader navigation={navigation} />
      </View>
      <ScrollColumns
        navigation={navigation}
        data={data}
      />
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
