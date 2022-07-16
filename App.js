import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/screens/Home";
import AddToDo from "./src/screens/AddToDo";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTodo"
            component={AddToDo}
            options={{
              title: "Volver",
              animation: "slide_from_bottom",
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
