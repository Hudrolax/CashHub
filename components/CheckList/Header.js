import { View, StyleSheet, Text } from "react-native";
import ArchiveButton from "./ArchiveBtn";
import LittleBackButton from "./LittleBackBtn";


function Header({ style, navigation, caption, btnName }) {
    return (
        <View style={{...styles.container, ...style}}>
            <Text style={styles.caption}>{caption}</Text>
            {btnName === 'Архив' && <ArchiveButton onPress={() => navigation.navigate("ArchiveChecklist")}/>}
            {btnName === 'Назад' && <LittleBackButton onPress={() => navigation.goBack()}/>}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
    },
    caption: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
  });
  
  export default Header;