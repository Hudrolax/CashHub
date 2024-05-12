import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";

const CircleItem = ({
  title,
  circleColor,
  circleText,
  subtitle,
  subtitleColor,
  object,
  onPress,
  btnType,
}) => {
  const pressedWallet1 = useSelector(
    (state) => state.stateReducer.pressedWallet1
  );
  const pressedWallet2 = useSelector(
    (state) => state.stateReducer.pressedWallet2
  );
  const pressedExInItem = useSelector(
    (state) => state.stateReducer.pressedExInItem
  );
  const pressedDate = useSelector((state) => state.stateReducer.pressedDate);
  // const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);

  let isPressed = false;
  if (
    btnType === "date" && pressedDate && pressedDate.id === object.id
    || btnType === 'exInItem' && pressedExInItem && pressedExInItem.id == object.id
    || btnType === 'wallet' && pressedWallet1 && pressedWallet1.id == object.id
    || btnType === 'wallet' && pressedWallet2 && pressedWallet2.id == object.id
  )
    isPressed = true;

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

  useEffect(() => {
    return () => {
      setUnpress();
    };
  }, []);

  const setUnpress = () => {
    animationRef.current && animationRef.current.stop();
    scaleValue.setValue(1);
  };

  const setPress = () => {
    animationRef.current = Animated.loop(pulseAnimation);
    animationRef.current.start();
  };

  if (isPressed) {
    setPress();
  } else {
    setUnpress();
  }

  const onPressBtn = () => {
    // const _isPressed = !isPressed;
    // const handlePress = () => {
    //   if (_isPressed) {
    //     animationRef.current = Animated.loop(pulseAnimation);
    //     animationRef.current.start();
    //   } else {
    //     animationRef.current && animationRef.current.stop();
    //     scaleValue.setValue(1);
    //   }
    //   setIsPressed(_isPressed);
    // };
    onPress(object);
  };

  const sybtitleStyle = () => {
    if (!subtitleColor) {
      return styles.subtitle;
    } else {
      return { ...styles.subtitle, color: subtitleColor };
    }
  };

  const borderStyle = () => {
    let style = {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#fff",
      borderRadius: 50,
      aspectRatio: 1,
    };
    if (isPressed) {
      style = { ...style, height: 70, borderColor: "#fff", borderWidth: 2 };
    }
    return style;
  };

  return (
    <TouchableWithoutFeedback onPress={onPressBtn}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={borderStyle()}>
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
