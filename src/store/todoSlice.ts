import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToIndexedDB, deleteFromIndexedDB } from '../db/indexedDB.ts'; 

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
}

interface TodoState {
  todos: Todo[];
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [] as Todo[],
  } as TodoState,
  reducers: {
    addTodo(state, action: PayloadAction<{ text: string }>) {
      const tagsInText = action.payload.text.match(/#\w+/g) || [];
      const newTodo: Todo = {
        id: new Date().toISOString(),
        text: action.payload.text,
        completed: false,
        tags: tagsInText.map(tag => tag.slice(1)),
      };
      state.todos.push(newTodo);
      addToIndexedDB(newTodo); 
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      deleteFromIndexedDB(action.payload); 
    },
    toggleToDoComplete(state, action: PayloadAction<{ id: string }>) {
      const todoToToggle = state.todos.find(todo => todo.id === action.payload.id);
      if (todoToToggle) {
        todoToToggle.completed = !todoToToggle.completed;
      }
    },
    editText(state, action: PayloadAction<{ id: string, newText: string }>) {
      const { id, newText } = action.payload;
      const matchedTags = newText.match(/#\w+/g);
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id
            ? {
                ...todo,
                text: newText,
                tags: matchedTags ? matchedTags.map(tag => tag.slice(1)) : [],
              }
            : todo
        ),
      };
    },
    loadTodosFromDB(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
  },
});

export const { addTodo, removeTodo, toggleToDoComplete, editText, loadTodosFromDB} = todoSlice.actions;

export default todoSlice.reducer;
