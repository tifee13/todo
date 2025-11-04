import React, { useState } from 'react';
import {
  Pressable,
  Alert,
  View,
  Text,
  Image,
  Platform, 
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const iconCheck = require('../assets/images/icon-check.png');
const iconCross = require('../assets/images/icon-cross.png');

const ItemContainer = styled.Pressable<{ $isActive: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  background-color: ${(props) => props.theme.card};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.textPlaceholder}30;

  ${(props) =>
    props.$isActive &&
    css`
      /* Native shadow */
      elevation: 3;
      shadow-color: #000;
      shadow-offset: 0px 5px;
      shadow-opacity: 0.1;
      shadow-radius: 5px;

      /* Web shadow */
      ${Platform.OS === 'web' && `
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
      `}
    `}
`;

const CheckboxContainer = styled.Pressable`
  margin-right: 12px;
`;
const CheckboxOuter = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.textPlaceholder}40;
`;
const CheckboxGradient = styled(LinearGradient)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;
const CheckIcon = styled.Image`
  width: 12px;
  height: 12px;
`;
const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
`;
const TaskText = styled.Text<{ $completed: boolean }>`
  font-size: 18px;
  font-family: 'Josefin Sans';
  color: ${(props) => (props.$completed ? props.theme.textCompleted : props.theme.text)};
  text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
  text-decoration-color: ${(props) => props.theme.textCompleted};
`;
const DeleteButton = styled.Pressable`
  margin-left: 16px;
  padding: 4px;
`;
const CrossIcon = styled.Image`
  width: 18px;
  height: 18px;
`;

type TaskItemProps = {
  task: Doc<'tasks'>;
  drag: () => void;
  isActive: boolean;
};

export default function TaskItem({
  task,
  drag,
  isActive,
}: TaskItemProps) {
  const updateCompletion = useMutation(api.tasks.updateCompletion);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const { theme } = useTheme();

  const [isHovered, setIsHovered] = useState(false);

  const toggleComplete = async () => {
    try {
      await updateCompletion({
        id: task._id,
        completed: !task.completed,
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask({ id: task._id });
    } catch (e) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  return (
    <ItemContainer
      onLongPress={drag}
      delayLongPress={150}
      $isActive={isActive}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <CheckboxContainer onPress={toggleComplete}>
        {task.completed ? (
          <CheckboxGradient
            colors={[theme.checkGradientFrom, theme.checkGradientTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <CheckIcon source={iconCheck} />
          </CheckboxGradient>
        ) : (
          <CheckboxOuter />
        )}
      </CheckboxContainer>

      <TextContainer>
        <TaskText $completed={task.completed}>{task.title}</TaskText>
      </TextContainer>

      {(isHovered || Platform.OS !== 'web') && (
        <DeleteButton onPress={handleDelete}>
          <CrossIcon source={iconCross} resizeMode="contain" />
        </DeleteButton>
      )}
    </ItemContainer>
  );
}