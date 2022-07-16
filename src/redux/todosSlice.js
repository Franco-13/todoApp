import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodosReducer: (state, action) => {
      state.todos = action.payload;
    },
    addTodoReducer: (state, action) => {
      state.todos.push(action.payload);
    },
    hideCompletedReducer: (state) => {
      state.todos = state.todos.filter((t) => !t.isCompleted);
    },
    updateTodoReducer: (state, action) => {
      state.todos = state.todos.map((t) => {
        if (t.id === action.payload.id) {
          t.isCompleted = !t.isCompleted;
        }
        return t;
      });
    },
    deleteTodoReducer: (state, action) => {
      const id = action.payload;
      const todos = state.todos.filter((t) => t.id !== id);
      state.todos = todos;
    },
  },
});

export const {
  setTodosReducer,
  addTodoReducer,
  hideCompletedReducer,
  updateTodoReducer,
  deleteTodoReducer,
} = todosSlice.actions;

export default todosSlice.reducer;
