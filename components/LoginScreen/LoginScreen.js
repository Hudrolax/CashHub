import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";

import { baseEndpoint } from "../requests";
import { setIsLoading, setLoginData } from "../actions";
import { fetchRequest } from "../requests";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fetchLogin = async () => {
    dispatch(setIsLoading(true));
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

      const user = await fetchRequest(dispatch, data.token, null, `/users/${data.user_id}`, 'GET', null, true)

      // Сохранение токена в SecureStore
      await Promise.all([
        SecureStore.setItemAsync("token", data.token),
        SecureStore.setItemAsync("user", JSON.stringify(user))
    ]);

      dispatch(setLoginData(data.token, user))
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
    dispatch(setIsLoading(false));
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
