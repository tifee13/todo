import React, { useState, useEffect } from 'react';
import { Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

// --- Styled Components (No changes) ---
const ModalContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.bg};
`;
const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.textPlaceholder}30;
`;
const ModalTitle = styled.Text`
  font-size: 24px;
  font-family: 'Josefin Sans';
  font-weight: 700;
  color: ${(props) => props.theme.text};
`;
const FormContainer = styled.View`
  padding: 24px;
  gap: 16px;
`;
const StyledInput = styled.TextInput<{ $multiline?: boolean }>`
  font-size: 18px;
  font-family: 'Josefin Sans';
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.textPlaceholder}40;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.card};

  ${(props) =>
    props.$multiline &&
    `
    min-height: 120px;
    text-align-vertical: top;
  `}
`;
const SaveButton = styled.Pressable`
  background-color: ${(props) => props.theme.brightBlue};
  padding: 16px;
  border-radius: 6px;
  align-items: center;
`;
const SaveButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-family: 'Josefin Sans';
  font-weight: 700;
`;
// --- End Styled Components ---

export default function TaskModal() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams();
  
  const taskId = params.id ? (params.id as Id<'tasks'>) : null;
  
  const taskData = useQuery(api.tasks.getById, taskId ? { id: taskId } : 'skip');
  
  const createTask = useMutation(api.tasks.create);
  const updateTaskDetails = useMutation(api.tasks.updateDetails);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----- THIS IS THE FIX -----
  useEffect(() => {
    if (taskData) {
      // We are in EDIT mode and data has loaded
      setTitle(taskData.title);
      setDescription(taskData.description || '');
      setDueDate(taskData.dueDate || '');
    } else if (!taskId) {
      // We are in NEW TASK mode, so clear the form
      setTitle('');
      setDescription('');
      setDueDate('');
    }
    // We add taskId to the dependency array
    // This ensures the effect re-runs if we switch from "New" to "Edit"
  }, [taskData, taskId]); 
  // ----- END OF FIX -----

  const handleSave = async () => {
    if (!title) {
      Alert.alert('Title is required');
      return;
    }
    setIsSubmitting(true);

    try {
      if (taskId && taskData) {
        await updateTaskDetails({
          id: taskId,
          title,
          description: description || undefined,
          dueDate: dueDate || undefined,
        });
      } else {
        await createTask({
          title,
          description: description || undefined,
          dueDate: dueDate || undefined,
        });
      }
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <HeaderContainer>
        <ModalTitle>{taskId ? 'Edit Task' : 'New Task'}</ModalTitle>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons
            name="close-circle"
            size={30}
            color={theme.textPlaceholder}
          />
        </Pressable>
      </HeaderContainer>

      <FormContainer>
        <StyledInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={theme.textPlaceholder}
        />
        <StyledInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={theme.textPlaceholder}
          multiline
          $multiline={true}
        />
        <StyledInput
          placeholder="Due Date (optional)"
          value={dueDate}
          onChangeText={setDueDate}
          placeholderTextColor={theme.textPlaceholder}
        />

        <SaveButton
          onPress={handleSave}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <SaveButtonText>{isSubmitting ? 'Saving...' : 'Save'}</SaveButtonText>
        </SaveButton>
      </FormContainer>
    </ModalContainer>
  );
}