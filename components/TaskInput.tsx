import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.card};
  padding: 14px 20px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const CheckboxPlaceholder = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.textPlaceholder}40;
  margin-right: 12px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  font-family: 'Josefin Sans';
  color: ${(props) => props.theme.text};
`;

export default function TaskInput() {
  const [title, setTitle] = useState('');
  const createTask = useMutation(api.tasks.create);
  const { theme } = useTheme();

  const handleCreateTask = async () => {
    if (!title.trim()) {
      return;
    
    }
    try {
      await createTask({ title });
      setTitle(''); 
    } catch (e) {
      Alert.alert('Error', 'Failed to create task');
      console.error(e);
    }
  };

  return (
    <InputContainer>
      <CheckboxPlaceholder />
      <StyledInput
        placeholder="Create a new todo..."
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleCreateTask}
        returnKeyType="done"
        placeholderTextColor={theme.textPlaceholder}
      />
    </InputContainer>
  );
}