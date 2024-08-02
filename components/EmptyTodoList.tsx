import { Colors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function EmptyTodoList() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="clipboard-list" size={44} color={Colors.primary} />
      <Text style={{ color: 'gray', marginTop: 20, fontStyle: 'italic' }}>
        Your Todo List is Empty.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: "60%",
  },
});
