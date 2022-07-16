import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StyleSheet, TouchableOpacity, View } from "react-native";

const Checkbox = ({ id, text, isCompleted, isToday, hour }) => {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todos.todos);

  const handleCheckbox = async () => {
    try {
      dispatch(updateTodoReducer({ id, isCompleted }));
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify(
          todoList.map((t) => {
            if (t.id === id) {
              return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return isToday ? (
    <TouchableOpacity
      onPress={handleCheckbox}
      style={isCompleted ? styles.checked : styles.unchecked}
    >
      {isCompleted && <Entypo name="check" size={16} color="#fafafa" />}
    </TouchableOpacity>
  ) : (
    <View style={styles.noToday} />
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  checked: {
    width: 20,
    height: 20,
    marginRight: 13,
    marginLeft: 15,
    borderRadius: 6,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  unchecked: {
    width: 20,
    height: 20,
    marginRight: 13,
    marginLeft: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e8e8e8",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  noToday: {
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "#262626",
    marginRight: 13,
    marginLeft: 15,
  },
});
