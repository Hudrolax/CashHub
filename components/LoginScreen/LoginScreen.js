import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";

import { baseEndpoint } from "../requests";
import { setIsLoadin, setLogin, setUsername } from "../actions";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fetchLogin = async () => {
    dispatch(setIsLoadin(true));
    setError("");
    try {
      const response = await fetch(baseEndpoint + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 404) {
        throw new Error("Неверный логин или пароль");
      } else if (response.status !== 200) {
        throw new Error(data.detail);
      }

      // Сохранение токена в SecureStore
      await SecureStore.setItemAsync("userToken", data.token);
      await SecureStore.setItemAsync("username", username);
      dispatch(setLogin(data.token));
      dispatch(setUsername(username));
    } catch (error) {
      setError(error.message);
      // console.error(error.message);
    }
    dispatch(setIsLoadin(false));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={"grey"}
        value={username}
        onChangeText={(text) => setLocalUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"grey"}
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Login"
        disabled={!username || !password}
        color={!username || !password ? "grey" : "#02af59"}
        onPress={fetchLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181715",
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
