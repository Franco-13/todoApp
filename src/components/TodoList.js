import React from "react";
import { FlatList } from "react-native";

import TodoItem from "./TodoItem";

const TodoList = ({ todosData }) => {
  return (
    <FlatList
      data={todosData}
      keyExtractor={(e) => e.id.toString()}
      renderItem={({ item }) => <TodoItem {...item} />}
    />
  );
};

export default TodoList;
