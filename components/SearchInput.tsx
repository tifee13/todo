import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; // Import icons

// --- Styled Components ---

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.card};
  padding: 14px 20px;
  border-radius: 6px;
  margin-bottom: 16px; /* Space before the list */
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  font-family: 'Josefin Sans';
  color: ${(props) => props.theme.text};
  margin-left: 12px; /* Space after the icon */
`;

// --- End Styled Components ---

type Props = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchInput({ searchQuery, setSearchQuery }: Props) {
  const { theme } = useTheme();

  return (
    <InputContainer>
      {/* Add the search icon */}
      <Ionicons name="search" size={20} color={theme.textPlaceholder} />
      
      <StyledInput
        placeholder="Search for a todo..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        placeholderTextColor={theme.textPlaceholder}
      />
    </InputContainer>
  );
}