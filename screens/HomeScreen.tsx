import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AddNewTodoItem } from "../services/todoServices";
import { Colors } from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { sortTodoListByCompletion } from "../utils/SortTodos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyTodoList from "../components/EmptyTodoList";
import React, { useLayoutEffect, useMemo, useState } from "react";
import TodoItem from "../components/TodoItem";

export interface TodoItemProps {
  id: string;
  todo: string;
  isCompleted: boolean;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TodoItemProps[]>([]);
  const [todo, setTodo] = useState("");

  const sortedTodoList = useMemo(() => {
    return sortTodoListByCompletion(tasks);
  }, [tasks]);

  async function addNewTodo() {
    if (todo.length < 3) {
      Alert.alert("Error", "Todo text must be at least 3 characters long.");
      return;
    }
    const todoItem: TodoItemProps = {
      isCompleted: false,
      todo,
      id: Date.now().toString(),
    };
    const newList = [todoItem, ...tasks];
    setTasks(newList);
    await AddNewTodoItem(newList);
    setTodo("");
  }

  async function fetchTodoList() {
    try {
      const todoListJson = await AsyncStorage.getItem("todo-list");
      const todoList = todoListJson != null ? JSON.parse(todoListJson) : [];
      setTasks(todoList);
    } catch (error) {
      console.error("Error getting the Todo List:", error);
    }
  }

  useLayoutEffect(() => {
    fetchTodoList();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Add New Task"
          onEndEditing={addNewTodo}
          returnKeyType="done"
          onChangeText={setTodo}
          defaultValue={todo}
        />
        <TouchableOpacity style={styles.button} onPress={addNewTodo}>
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedTodoList}
        renderItem={({ item }) => (
          <TodoItem data={item} key={item.id} onUpdate={fetchTodoList} />
        )}
        ListEmptyComponent={EmptyTodoList}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: Colors.secondary,
  },
  content: {
    marginTop: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    color: Colors.primary,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    height: 50,
    width: "18%",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    columnGap: 10,
  },
  input: {
    height: 50,
    borderRadius: 8,
    width: "80%",
    backgroundColor: "white",
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: "rgba(0,0,0,0.6)",
  },
});
