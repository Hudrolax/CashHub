import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const MenuItem = ({ title, onPress }) => {

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)', // Подгоните цвет под ваш дизайн
  },
  title: {
    color: 'white', // Используйте цвет текста из вашего дизайна
    fontSize: 18, // Подгоните размер текста под ваш дизайн
    flex: 1,
  },
});

export default MenuItem;
