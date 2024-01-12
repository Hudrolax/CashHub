import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import store from "./components/store";

export default function App() {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <NavigationContainer>
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
                onPress={() => console.log(1)}
              />
            </View>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
