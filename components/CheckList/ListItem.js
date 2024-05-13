import {
  View,
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import CheckBox from "./CheckBox";
import { daysBetween } from "../util";

function ListItem({ item, onUpdate, onDelete }) {
  const textStyle = () =>
    item.checked ? { textDecorationLine: "line-through", color: 'grey' } : {};

  const pan = useRef(new Animated.Value(0)).current; // Изменено на Animated.Value
  const [swiped, setSwiped] = useState(false);

  const onSwipe = () => {
    onDelete(item);
  };

  // Получаем ширину экрана
  const screenWidth = Dimensions.get("window").width;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 500;
    },
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dx > 0) { // Проверяем, что движение вправо
        pan.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > screenWidth / 2) {
        // Порог свайпа вправо
        Animated.spring(pan, {
          toValue: Dimensions.get("window").width,
          useNativeDriver: true,
        }).start(() => {
          setSwiped(true);
          onSwipe();
        });
      } else {
        // Возврат на исходную позицию
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (swiped) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan }],
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.container}>
        <CheckBox
          style={{ marginRight: 10 }}
          checked={item.checked}
          onPress={() =>
            onUpdate({ ...item, checked: !item.checked})
          }
        />
        {item.modified && <Text>⏳</Text>}
        <Text style={{ color: "#fff", ...textStyle() }}>{`${item.text} (${
          item.user.name
        } ${daysBetween(item.date)} дн.)`}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "95%",
  },
});

export default ListItem;
