import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AddBtn from "./AddBtn";
import CompleteBtn from "./CompleteBtn";
import BackBtn from "./BackBtn";

function Footer({ style, onAdd, onComplete }) {
  const addMode = useSelector((state) => state.stateReducer.checklistAddMode);
  const itemText = useSelector((state) => state.stateReducer.checklistNewItemText);

  return (
    <View style={{ ...styles.container, ...style }}>
      {addMode ? (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          <CompleteBtn onPress={() => onComplete(itemText)}/>
          <BackBtn onPress={() => onComplete("")}/>
        </View>
      ) : (
        <AddBtn onPress={onAdd} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#22232b",
  },
  caption: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Footer;
