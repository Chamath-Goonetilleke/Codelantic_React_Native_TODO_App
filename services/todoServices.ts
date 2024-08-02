import { TodoItemProps } from "@/screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Adding a new todo to todo list 
export const AddNewTodoItem = async (newList: TodoItemProps[]) => {
  try {
    await AsyncStorage.setItem("todo-list", JSON.stringify(newList));
  } catch (error) {
    console.error("Failed to add todo item:", error);
  }
};
// Marking a todo as completed
export const MarkAsCompleted = async (
  id: string,
  currentStatus: boolean,
  onUpdate: () => void
) => {
  try {
    const todoListJson = await AsyncStorage.getItem("todo-list");
    const todoList = todoListJson ? JSON.parse(todoListJson) : [];
    const updatedList = todoList.map((item: TodoItemProps) => {
      if (item.id === id) {
        return { ...item, isCompleted: !currentStatus };
      }
      return item;
    });
    await AsyncStorage.setItem("todo-list", JSON.stringify(updatedList));
    onUpdate();
  } catch (error) {
    console.error("Failed to update todo item:", error);
  }
};

// Editing a todo item
export const EditTodoItem = async (
  id: string,
  newTodo: string,
  onUpdate: () => void
) => {
  if (!newTodo) return;
  try {
    const todoListJson = await AsyncStorage.getItem("todo-list");
    const todoList = todoListJson ? JSON.parse(todoListJson) : [];
    const updatedList = todoList.map((item: TodoItemProps) => {
      if (item.id === id) {
        return { ...item, todo: newTodo };
      }
      return item;
    });
    await AsyncStorage.setItem("todo-list", JSON.stringify(updatedList));
    onUpdate();
  } catch (error) {
    console.error("Failed to edit todo item:", error);
  }
};

// Deleting a todo item
export const DeleteTodoItem = async (id: string, onUpdate: () => void) => {
  try {
    const todoListJson = await AsyncStorage.getItem("todo-list");
    const todoList = todoListJson ? JSON.parse(todoListJson) : [];
    const updatedList = todoList.filter(
      (item: TodoItemProps) => item.id !== id
    );
    await AsyncStorage.setItem("todo-list", JSON.stringify(updatedList));
    onUpdate();
  } catch (error) {
    console.error("Failed to delete todo item:", error);
  }
};