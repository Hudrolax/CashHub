import { View, StyleSheet } from 'react-native';
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";

import MenuItem from './MenuItem';
import { setLoginData } from '../actions';


export default function SettingsScreen() {
  const dispatch = useDispatch();

  const items = [
    {id: 1, title: 'Выйти', onPress: async () => {
      await SecureStore.setItemAsync("userToken", "");
      await SecureStore.setItemAsync("user", "");
      dispatch(setLoginData('', undefined))
    }},
  ]

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <MenuItem key={item.id} title={item.title} onPress={item.onPress}/>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181715",
    justifyContent: "flex-start"
  },
});