import { View, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setCheckNewItemText } from "../actions";

function NewItem({ style, onComplete }) {
  const dispatch = useDispatch();
  const itemText = useSelector((state) => state.stateReducer.checklistNewItemText);

  return (
    <View style={{ ...styles.container, ...style }}>
      <TextInput
        style={styles.input}
        placeholder="Что купить?"
        placeholderTextColor="grey"
        value={itemText}
        onChangeText={(text) => dispatch(setCheckNewItemText(text))}
        autoFocus={true}
        onSubmitEditing={() => onComplete(itemText)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "95%",
  },
  input: {color: "#fff"}
});

export default NewItem;
