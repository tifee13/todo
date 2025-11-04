import React from 'react';
import { View, Pressable, Text } from 'react-native';
import styled from 'styled-components/native';

const FilterButtonContainer = styled.View`
  /* This is the critical line that puts them in a row */
  flex-direction: row; 
  justify-content: center;
  align-items: center;
`;

const FilterPressable = styled.Pressable`
  padding: 4px 8px;
  margin: 0 8px;
`;

const FilterText = styled.Text<{ $isActive: boolean }>`
  font-size: 16px;
  font-family: 'Josefin Sans';
  font-weight: 700;
  color: ${(props) =>
    props.$isActive ? props.theme.brightBlue : props.theme.textPlaceholder};
`;

type FilterType = 'all' | 'active' | 'completed';

type Props = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
};

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export default function FilterButtons({ filter, setFilter }: Props) {
  return (
    <FilterButtonContainer>
      {filters.map((f) => (
        <FilterPressable key={f.value} onPress={() => setFilter(f.value)}>
          <FilterText $isActive={filter === f.value}>{f.label}</FilterText>
        </FilterPressable>
      ))}
    </FilterButtonContainer>
  );
}