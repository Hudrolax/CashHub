import React, { useEffect, useRef } from "react";
import { Animated, Easing, Modal, View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LoadingOverlay = ({ visible, connectionError }) => {
  // Анимационные значения
  const rotate = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = useRef(new Animated.Value(0)).current;

  // Анимация вращения
  const startRotateAnimation = () => {
    rotate.setValue(0);
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start((e) => {
      if (e.finished) {
        startRotateAnimation();
      }
    });
  };

  // Анимация dash
  const startDashAnimation = () => {
    strokeDashoffset.setValue(0);
    Animated.sequence([
      Animated.timing(strokeDashoffset, {
        toValue: -35,
        duration: 750,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(strokeDashoffset, {
        toValue: -124,
        duration: 750,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start((e) => {
      if (e.finished) {
        startDashAnimation();
      }
    });
  };

  // Запуск анимации при монтировании
  useEffect(() => {
    if (visible) {
      startRotateAnimation();
      startDashAnimation();
    }
  }, [visible]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Svg height="50" width="50" viewBox="0 0 50 50">
            <AnimatedCircle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
              strokeDasharray="90, 150"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="#B3DFFC"
            />
          </Svg>
        </Animated.View>
        {connectionError ? (
          <Text style={styles.textStyle}>
            Потеряно соединение с сервером. Проверьте работоспособность
            интернета.
          </Text>
        ) : (
          undefined
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  textStyle: {
    marginTop: 20, // Отступ от анимации
    color: "white", // Цвет текста
    fontSize: 16, // Размер шрифта
    textAlign: "center", // Выравнивание текста
    paddingHorizontal: 20, // Отступы справа и слева для ограничения ширины текста
  },
});

export default LoadingOverlay;
