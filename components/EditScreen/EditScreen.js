import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Vibration,
  BackHandler,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";

import { orangeColor, greenColor, redColor } from "../colors";
import ListItem from "./ListItem";
import { setEditContentType } from "../actions";

export default function EditScreen({ navigation }) {
  const dispatch = useDispatch();
  const contentType = useSelector((state) => state.mainState.editContentType);
  const wallets = useSelector((state) => state.mainState.wallets);
  const exInItems = useSelector((state) => state.mainState.exInItems);

  let headerStyle;
  let headerText;

  if (contentType === "wallets") {
    headerStyle = { backgroundColor: orangeColor };
    headerText = "Счета";
  } else if (contentType === "income") {
    headerStyle = { backgroundColor: greenColor };
    headerText = "Статьи";
  } else if (contentType === "outcome") {
    headerStyle = { backgroundColor: redColor };
    headerText = "Статьи";
  }

  const onCancel = () => {
    Vibration.vibrate(2);
    navigation.navigate("Tabs");
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onCancel
    );

    return () => {
      backHandler.remove();
      dispatch(setEditContentType(undefined));
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.header, ...headerStyle }}>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {headerText}
        </Text>
      </View>
      <ScrollView>
        {contentType === "wallets"
          ? wallets.map((item) => (
              <ListItem key={item.id} navigation={navigation} item={item} />
            ))
          : exInItems.map((item) => (
              <ListItem key={item.id} navigation={navigation} item={item} />
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181715",
  },
  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
