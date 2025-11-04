import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TaskDeleteActionProps = {
  onDelete: () => void;
};

export default function TaskDeleteAction({ onDelete }: TaskDeleteActionProps) {
  return (
    <Pressable
      onPress={onDelete}
      className="
        bg-red-600
        justify-center
        items-center
        w-20
        h-full
        my-2
        rounded-r-lg
      "
    >
      <View className="justify-center items-center">
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text 
          className="text-white text-xs" 
          style={{ fontFamily: 'Josefin Sans' }}
        >
          Delete
        </Text>
      </View>
    </Pressable>
  );
}