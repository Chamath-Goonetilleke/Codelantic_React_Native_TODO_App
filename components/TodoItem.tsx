import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";
import { TodoItemProps } from "@/screens/HomeScreen";
import {
  MarkAsCompleted,
  DeleteTodoItem,
  EditTodoItem,
} from "@/services/todoServices";
import Modal from "react-native-modal";
import React, { useState } from "react";

export default function TodoItem({
  data,
  onUpdate,
}: {
  data: TodoItemProps;
  onUpdate: () => void;
}) {
  const { todo, isCompleted, id } = data;
  const [completed, setCompleted] = useState<boolean>(isCompleted);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editText, setEditText] = useState(todo);

  const handleCheckAsCompleted = () => {
    MarkAsCompleted(id, completed, () => {
      setCompleted(!completed);
      onUpdate();
    });
  };

  const handleDeleteMyTodo = () => {
    DeleteTodoItem(id, () => {
      onUpdate();
      hideMenu();
    });
  };

  const handleEditMyTodo = (newTodo: string) => {
    if (!newTodo) return;
    EditTodoItem(id, newTodo, () => {
      onUpdate();
      hideMenu();
    });
  };

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleEdit = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Edit Todo Description",
        "Enter New Todo Text:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: (newTodo) => {
              if (typeof newTodo === "string" && newTodo.length > 3) {
                handleEditMyTodo(newTodo);
              } else {
                Alert.alert(
                  "Error",
                  "Todo text must be at least 3 characters long."
                );
                hideMenu();
              }
            },
          },
        ],
        "plain-text",
        todo
      );
    } else {
      setEditText(todo);
      toggleModal();
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable onPress={handleCheckAsCompleted}>
          <MaterialCommunityIcons
            name={completed ? "checkbox-marked" : "checkbox-blank-outline"}
            size={28}
            color={Colors.primary}
          />
        </Pressable>
        <Text style={styles.todo}>{todo}</Text>
      </View>

      <Menu
        visible={visible}
        onRequestClose={hideMenu}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={28}
              color={Colors.primary}
            />
          </TouchableOpacity>
        }
      >
        <MenuItem onPress={handleEdit} style={styles.menuItem}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={22}
              color={Colors.primary}
            />
            <Text>Edit</Text>
          </View>
        </MenuItem>
        <MenuItem
          style={styles.menuItem}
          onPress={() => {
            hideMenu();
            Alert.alert("Alert", "Are you sure you want to delete this item?", [
              { text: "Cancel", onPress: () => null },
              {
                text: "Delete",
                style: "destructive",
                onPress: handleDeleteMyTodo,
              },
            ]);
          }}
        >
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="delete"
              size={22}
              color={Colors.primary}
            />
            <Text>Delete</Text>
          </View>
        </MenuItem>
      </Menu>

      {Platform.OS === "android" && (
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.modalButton}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleEditMyTodo(editText);
                  toggleModal();
                }}
                style={styles.modalButton}
              >
                <Text>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todo: { fontSize: 16, maxWidth:'80%' },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  card: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 12,
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    marginLeft: Platform.OS === "ios" ? 10 : 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  modalInput: {
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    padding: 10,
  },
});
