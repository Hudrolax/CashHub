import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Easing,
  Vibration,
} from "react-native";
import {
  setPressWallet1,
  setPressWallet2,
  setPressExInItem,
  setPressDate,
} from "../actions";

import { isEmpty } from "../util";

const CircleItem = ({
  title,
  circleColor,
  circleText,
  subtitle,
  subtitleColor,
  object,
  object_type,
  pressible,
}) => {
  const dispatch = useDispatch();
  const pressedWallet1 = useSelector((state) => state.stateReducer.pressedWallet1);
  const pressedWallet2 = useSelector((state) => state.stateReducer.pressedWallet2);
  const pressedExInItem = useSelector(
    (state) => state.stateReducer.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.stateReducer.pressedDate);
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);

  const pulseAnimation = Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 1.3,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
  ]);

  const handlePress = () => {
    if (!pressible) return;
    // Vibration.vibrate(1);
    if (isPressed) {
      animationRef.current && animationRef.current.stop();
      scaleValue.setValue(1);
      setIsPressed(false);

      switch (object_type) {
        case "wallet":
          if (isEmpty(pressedWallet2)) {
            dispatch(setPressWallet1({}));
          } else {
            dispatch(setPressWallet2({}));
          }
          break;
        case "exInItem":
          dispatch(setPressExInItem({}));
          break;
        case "date":
          dispatch(setPressDate({}));
          break;
      }
    } else {
      switch (object_type) {
        case "wallet":
          if (
            !isEmpty(pressedWallet2) ||
            (!isEmpty(pressedExInItem) && !isEmpty(pressedWallet1))
          )
            return;
          if (isEmpty(pressedWallet1)) {
            dispatch(setPressWallet1(object));
          } else {
            dispatch(setPressWallet2(object));
          }
          break;
        case "exInItem":
          if (
            (!isEmpty(pressedExInItem) && pressedExInItem.name !== title) ||
            !isEmpty(pressedWallet2)
          )
            return;
          dispatch(setPressExInItem(object));
          break;
        case "date":
          if (!isEmpty(pressedDate) && pressedDate.date !== object.date) return;
          dispatch(setPressDate(object));
          break;
      }
      animationRef.current = Animated.loop(pulseAnimation);
      animationRef.current.start();
      setIsPressed(true);
    }
  };

  useEffect(() => {
    return () => {
      // Очистка анимации
      if (animationRef.current) {
        animationRef.current.stop();
        scaleValue.setValue(1);
      }
    };
  }, []);

  useEffect(() => {
    if (
      ((!isEmpty(pressedWallet1) && !isEmpty(pressedExInItem)) ||
        (!isEmpty(pressedWallet1) && !isEmpty(pressedWallet2))) &&
      !isEmpty(pressedDate) &&
      animationRef.current
    ) {
      animationRef.current.stop();
      scaleValue.setValue(1);
      setIsPressed(false);
    }
  }, [pressedWallet1, pressedWallet2, pressedExInItem, pressedDate]);

  const sybtitleStyle = () => {
    if (!subtitleColor) {
      return styles.subtitle;
    } else {
      return { ...styles.subtitle, color: subtitleColor };
    }
  };

  const borderStyle = () => {
    let style = {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: "#fff",
      borderRadius: 50,
      aspectRatio: 1,
    }
    if (isPressed) {
      style = {...style, height: 70, borderColor: '#fff', borderWidth: 2}
    }
    return style
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={borderStyle()}
        >
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: circleColor,
                transform: [{ scale: scaleValue }],
              },
            ]}
          >
            <Text style={styles.circleText}>{circleText}</Text>
          </Animated.View>
        </View>
        <Text style={sybtitleStyle()}>{subtitle}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    marginVertical: 10, // Adjust as needed for spacing
  },
  title: {
    fontSize: 16, // Adjust your font size
    color: "#fff", // Adjust your color
    marginBottom: 5, // Space between title and circle
  },
  circle: {
    width: 50, // Adjust the size of the circle
    height: 50, // Adjust the size of the circle
    borderRadius: 30, // Half of width/height to make it a perfect circle
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 14, // Adjust your font size
    color: "#fff", // Text color inside the circle
  },
  subtitle: {
    fontSize: 16, // Adjust your font size
    color: "#fff", // Adjust your color
    marginTop: 5, // Space between circle and subtitle
  },
});

export default CircleItem;
