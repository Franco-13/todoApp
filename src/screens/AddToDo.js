import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddToDo = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const todoList = useSelector((state) => state.todos.todos);

  const [task, setTask] = useState("");
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [show, setShow] = useState(false);

  const [notification, setNotification] = useState(false);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const resHour = (h, m) => {
    let hourParse = "";
    let minParse = "";

    if (h < 10) {
      hourParse = `0${h.toString()}`;
    } else {
      hourParse = `${h.toString()}`;
    }
    if (m < 10) {
      minParse = `0${m.toString()}`;
    } else {
      minParse = `${m.toString()}`;
    }

    return `${hourParse}:${minParse}`;
  };

  const diaMs = 1000 * 60 * 60 * 24;
  console.log(diaMs);
  const suma = date.getTime() + diaMs;
  console.log("suma + 1 dia:", suma);
  console.log("suma +1 dia formato largo", new Date(suma));

  console.log("dia date.getTime():", date.getTime());
  let actualHour = new Date();
  console.log(
    "fechaActual:",
    actualHour.getTime(),
    " fechaActual: ",
    actualHour
  );
  console.log("MAÑANA", (suma - actualHour.getTime()) / 1000);

  console.log("dia", new Date(date.getTime()));
  console.log("result", date.getTime() - actualHour.getTime());
  let resultHourTomorrow = (suma - actualHour.getTime()) / 1000;

  let resultHour = (date.getTime() - actualHour.getTime()) / 1000;

  const maniana = new Date(suma);

  /* console.log("mañana", maniana); */

  const addTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: task,
      hour: isToday ? date.toString() : maniana.toString(),
      hourToNotification: isToday ? resultHour : resultHourTomorrow,
      isToday: isToday,
      isCompeted: false,
    };
    if ((resultHour > 0 && isToday) || (resultHourTomorrow > 0 && !isToday)) {
      try {
        await AsyncStorage.setItem(
          "@Todos",
          JSON.stringify([...todoList, newTodo])
        );

        dispatch(addTodoReducer(newTodo));

        if (notification) {
          await scheduleTodoNotification(newTodo /* , resultHour */);
        }
        navigation.goBack();
      } catch (error) {
        console.log("error", error);
      }
    } else {
      alert("La hora no es válida");
      return;
    }
  };

  const scheduleTodoNotification = async (todo /* , result */) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tienes una nueva tarea por hacer",
        body: todo.text,
      },
      trigger: { seconds: todo.hourToNotification },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar tarea</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Tarea</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tarea"
          placeholderTextColor="#00000030"
          onChangeText={(text) => {
            setTask(text);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hora</Text>
        <Text
          onPress={() => setShow(true)}
          style={styles.text}
          onChangeText={(text) => {
            setTask(text);
          }}
        >
          {resHour(hours, minutes)}
        </Text>
        {show && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedDate) => {
              setShow(false);
              setDate(selectedDate);
            }}
            style={{ width: "80%" }}
          />
        )}
      </View>
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.inputTitle}>Hoy</Text>
          <Text style={styles.warningText}>
            Si se desactiva 'Hoy', la tarea será considerada para mañana.
          </Text>
        </View>
        <Switch
          value={isToday}
          onValueChange={(value) => {
            setIsToday(value);
          }}
        />
      </View>
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.inputTitle}>Notificación</Text>
          <Text style={styles.warningText}>
            Si se activa recibirá una notificación.
          </Text>
        </View>
        <Switch
          value={notification}
          onValueChange={(value) => {
            setNotification(value);
          }}
        />
      </View>
      <TouchableOpacity onPress={addTodo} style={styles.button}>
        <Text style={styles.textButton}>Hecho</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddToDo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
  },
  inputContainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switchContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
  },
  text: {
    color: "#000",
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
    textAlignVertical: "center",
  },
  warningText: {
    color: "#00000030",
    maxWidth: "80%",
  },
  button: {
    marginTop: 30,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 42,
    borderRadius: 10,
  },
  textButton: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "300",
  },
});
