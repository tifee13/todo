import React from 'react';
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

const StyledPlaceholder = styled.Text`
  flex: 1;
  font-size: 18px;
  font-family: 'Josefin Sans';
  color: ${(props) => props.theme.textPlaceholder};
`;

export default function TaskInput() {
  const { theme } = useTheme();

  return (
    <InputContainer>
      <CheckboxPlaceholder />
      <StyledPlaceholder>Create a new todo...</StyledPlaceholder>
    </InputContainer>
  );
}