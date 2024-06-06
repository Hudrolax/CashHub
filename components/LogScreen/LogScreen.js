import React, { useCallback, useEffect, useState, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { showAlert } from "../util";

import DayLog from "./DayLog";
import LogHeader from "./LogHeader";
import { setTransactions, setTrzUpdateTime } from "../actions";
import { backendRequest, wallet_transactions_endpoint } from "../requests";
import CurrencySelector from "../HomeScreen/CurrencySelector";
import SearchLine from "./SearchLine";
import { NotModalLoadingOverlay } from "../overlays/loadingOverlay";

export default function LogScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginReducer.token);
  const mainCurrency = useSelector((state) => state.stateReducer.mainCurrency);
  const transactions = useSelector((state) => state.stateReducer.transactions);
  const trzUpdateTime = useSelector(
    (state) => state.stateReducer.trzUpdateTime
  );
  const trzLimit = useSelector((state) => state.stateReducer.trzLimit);
  const [searchView, setSearchView] = useState(false);
  const isTop = useRef(false);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result_transactions = await backendRequest({
        dispatch,
        token,
        endpoint: wallet_transactions_endpoint,
        method: "GET",
        queryParams: {
          currency_name: mainCurrency,
          date: trzLimit,
          filter: filterText,
        },
        throwError: true,
      });
      dispatch(setTransactions(result_transactions));
      dispatch(setTrzUpdateTime(new Date()));
    } catch (e) {
      showAlert("Ошибка", `Не удалось загрузить транзакции: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (new Date() - trzUpdateTime > 10000) loadData();
    }, [trzUpdateTime])
  );

  useEffect(() => {
    loadData();
  }, [mainCurrency, trzLimit, filterText]);

  useFocusEffect(
    useCallback(() => {
      setSearchView(false);
      isTop.current = 0;
    }, [])
  );

  const onFilterChange = (text) => {
    setFilterText(text);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < -20 && isTop.current === 0) {
      isTop.current = 1;
    } else if (offsetY === 0 && isTop.current === 1) {
      isTop.current = 2;
    } else if (offsetY < -20 && isTop.current === 2) {
      setSearchView(true);
    } else if (offsetY > 50) {
      isTop.current = 0;
      setSearchView(false);
      isTop.current = 0;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <CurrencySelector
          style={{ zIndex: 999, position: "absolute", top: 5, right: 8 }}
        />
        {searchView && (
          <SearchLine text={filterText} onChange={onFilterChange} />
        )}
        {!searchView && <LogHeader />}

        <View style={styles.transactionsContainer}>
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            {transactions.map((trzDay) => (
              <DayLog
                key={trzDay.date}
                navigation={navigation}
                trzDay={trzDay}
              />
            ))}
          </ScrollView>
          <NotModalLoadingOverlay visible={isLoading} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181715",
  },
  transactionsContainer: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
