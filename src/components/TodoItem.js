import React from "react";
import Checkbox from "./Checkbox";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteTodoReducer } from "../redux/todosSlice";

const TodoItem = ({
  id,
  text,
  isCompleted,
  isToday,
  hour,
  timestampToDisplay,
}) => {
  /*   const [month, day, year] =
    timestampToDisplay?.length && timestampToDisplay[0].split("/");
  const dateToDisplay = [day, month, year]?.join("/");
  const hourToDisplay = timestampToDisplay?.length && timestampToDisplay[1];
  console.log(
    console.log("timestamp", timestampToDisplay, dateToDisplay, hourToDisplay)
  ); */

  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todos.todos);

  const handleDeleteTodo = async () => {
    try {
      dispatch(deleteTodoReducer(id));
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify(todoList.filter((t) => t.id !== id))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkAndTodo}>
        <Checkbox
          id={id}
          text={text}
          isCompleted={isCompleted}
          isToday={isToday}
          hour={hour}
        />
        <View>
          <Text
            style={isCompleted ? [styles.text, styles.textLined] : styles.text}
          >
            {text}
          </Text>
          <Text
            style={isCompleted ? [styles.text, styles.textLined] : styles.text}
          >
            {timestampToDisplay}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleDeleteTodo}>
        <MaterialIcons name="delete-outline" size={24} color="#73737340" />
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkAndTodo: {
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737373",
  },
  textLined: {
    textDecorationLine: "line-through",
    color: "#73737330",
  },
  time: {
    fontSize: 13,
    color: "#a3a3a3",
    fontWeight: "500",
  },
});
