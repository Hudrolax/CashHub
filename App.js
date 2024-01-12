import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import store from "./components/store";
import MainScreenWrapper from "./components/MainScreenWrapper";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <Provider store={store}>
          <NavigationContainer>
            <MainScreenWrapper />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
