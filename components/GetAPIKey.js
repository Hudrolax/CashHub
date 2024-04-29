import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { fetchRequest } from "./util";
import { setOpenAPIKey } from "./actions";

function GetAPIKey() {
  const dispatch = useDispatch();
  const [api_key, setAPIKey] = useState("");

  const setApiKey = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await SecureStore.setItemAsync("OPENAI_API_KEY", api_key);
    try {
      let response = await fetchRequest(dispatch, {
        model: 'gpt-3.5-turbo-0125',
        messages: [{ role: "user", content: "Сколько будт 2+2?" }],
      });
      if (!response) throw new Error("empty response");
      response = response.choices[0].message.content;
      dispatch(setOpenAPIKey(api_key))
    } catch (error) {
      await SecureStore.setItemAsync("OPENAI_API_KEY", "");
      setAPIKey('')
      console.error(error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1b2026",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{
          fontSize: 12,
          textAlignVertical: "center",
          color: "#fff",
          height: 30,
          width: 400,
          borderColor: 'grey',
          borderWidth: 1,
        }}
        placeholder={`OpenAI API key`}
        placeholderTextColor="grey"
        value={api_key}
        onChangeText={(text) => setAPIKey(text)}
      />
      <TouchableOpacity
        style={{
          height: 30,
          width: 120,
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 1,
          margin: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={setApiKey}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          Сохранить
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default GetAPIKey;
