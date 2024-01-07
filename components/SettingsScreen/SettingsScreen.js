import { Text, View, StyleSheet } from 'react-native';
import { useDispatch } from "react-redux";

import MenuItem from './MenuItem';
import { setLogin } from "../LoginScreen/actions";


export default function SettingsScreen() {
  const dispatch = useDispatch();

  const items = [
    {id: 1, title: 'Выйти', onPress: () => dispatch(setLogin(''))},
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