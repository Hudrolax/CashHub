import AsyncStorage from "@react-native-async-storage/async-storage";


export function needUpdate(arr1, arr2) {
  if (!arr1 || !arr2) return true
  if (arr1.length !== arr2.length) return true

  const longestLength = arr1.length > arr2.length ? arr1.length : arr2.length
  for (let i = 0; i < longestLength; i++) {
    try {
      if (!shallowCompare(arr1[i], arr2[i])) {
        return true;
      }
    } catch {
      return true
    }
  }
  return false
}

export function shallowCompare(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Проверка на количество ключей
  if (keys1.length !== keys2.length) {
      return false;
  }

  for (let key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // Проверка на наличие ключа во втором объекте
      if (!keys2.includes(key)) {
          return false;
      }

      // Если значение - объект (но не Date), пропускаем сравнение
      if (typeof val1 === 'object' && typeof val2 === 'object' && !(val1 instanceof Date)) {
          continue;
      }

      // Особая проверка для объектов Date
      if (val1 instanceof Date && val2 instanceof Date) {
          if (val1.getTime() !== val2.getTime()) {
              return false;
          }
      } else if (val1 !== val2) {
          // Проверка обычных значений
          return false;
      }
  }

  return true;
}

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e)
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // ошибка чтения значения
    console.error("Error reading value from AsyncStorage", e);
  }
}
