import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { hideCompletedReducer, setTodosReducer } from "../redux/todosSlice";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import TodoList from "../components/TodoList";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const todoList = useSelector((state) => state.todos.todos);

  const [, setExpoPushToken] = useState("");
  useEffect(() => {
    registerForPushNotificationAsync()
      .then((token) => {
        console.log("token", token);
        setExpoPushToken(token);
      })
      .catch((e) => {
        console.log("ERROR TOKEN", e);
      });

    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("@Todos");
        if (todos !== null) {
          dispatch(setTodosReducer(JSON.parse(todos)));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  }, []);

  const [showCompleted, setShowCompleted] = useState(false);

  const handleShowCompleted = async () => {
    if (showCompleted) {
      setShowCompleted(false);
      const todos = await AsyncStorage.getItem("@Todos");
      if (todos !== null) {
        dispatch(setTodosReducer(JSON.parse(todos)));
      }
      /* setData(sortByTime); */
      return;
    }
    setShowCompleted(!showCompleted);
    dispatch(hideCompletedReducer());
    /* setData(sortByTime?.filter((i) => !i.isCompleted)); */
  };

  const registerForPushNotificationAsync = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("No se concedieron los permisos necesarios");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      return;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: "https://i.pinimg.com/564x/72/75/ec/7275ec2bf79fd65b06b6f19cd6e3a7ab.jpg",
        }}
      />
      <View style={styles.dayAndHideTodos}>
        <Text style={styles.text}>Hoy</Text>
        <TouchableOpacity onPress={handleShowCompleted}>
          <Text style={styles.showHidenText}>
            {showCompleted ? "Mostrar completadas" : "Oculata completadas"}
          </Text>
        </TouchableOpacity>
      </View>
      <TodoList todosData={todoList.filter((i) => i.isToday)} />
      <Text style={styles.text}>Mañana</Text>
      <TodoList todosData={todoList.filter((i) => !i.isToday)} />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddTodo")}
        style={styles.addButton}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 15,
  },
  showHidenText: {
    color: "#4285f6",
  },
  image: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
  },
  dayAndHideTodos: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 50,
    right: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  addText: {
    fontSize: 42,
    color: "#fff",
    position: "absolute",
    top: -9,
    left: 9,
  },
});
