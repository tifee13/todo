import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  View,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'expo-router';
import { Doc } from '@/convex/_generated/dataModel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import styled from 'styled-components/native'; 

import { useTheme } from '../context/ThemeContext'; 
import TaskItem from '../components/TaskItem';
import TaskInput from '../components/TaskInput';
import FilterButtons from '../components/FilterButtons';

const AppContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bg};
`;
const StyledImageBackground = styled.ImageBackground<{ $isDesktop: boolean }>`
  width: 100%;
  height: ${(props) => (props.$isDesktop ? 300 : 200)}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const ContentContainer = styled.View<{ $isDesktop: boolean }>`
  flex: 1;
  padding-horizontal: 24px;
  padding-top: ${(props) => (props.$isDesktop ? '70px' : '40px')};
  
  ${(props) =>
    props.$isDesktop &&
    `
    margin: 0 auto;
    width: 100%;
    max-width: 540px; 
  `}
`;
const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const TitleText = styled.Text`
  font-size: 30px;
  font-family: 'Josefin Sans';
  font-weight: 700;
  letter-spacing: 10px;
  color: #ffffff;
`;
const ThemeIcon = styled.Image`
  width: 26px;
  height: 26px;
`;
const ListContainer = styled.View`
  flex: 1;
  margin-top: 16px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.card};
  overflow: hidden;

  /* Native shadow */
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;

  /* Web shadow */
  ${Platform.OS === 'web' && `
    box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.1);
  `}
`;
const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
`;
const FooterText = styled.Text`
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: ${(props) => props.theme.textPlaceholder};
`;
const MobileFilterContainer = styled.View`
  margin-top: 16px;
  padding: 16px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.card};

  /* Native shadow */
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;

  /* Web shadow */
  ${Platform.OS === 'web' && `
    box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.1);
  `}
`;
const DragDropText = styled(FooterText)`
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
`;
const EmptyListText = styled(FooterText)`
  text-align: center;
  margin-top: 20px;
  padding: 20px;
`;

const bgMobileLight = require('../assets/images/bg-mobile-light.jpg');
const bgMobileDark = require('../assets/images/bg-mobile-dark.jpg');
const bgDesktopLight = require('../assets/images/bg-desktop-light.jpg');
const bgDesktopDark = require('../assets/images/bg-desktop-dark.jpg');
const iconSun = require('../assets/images/icon-sun.png');
const iconMoon = require('../assets/images/icon-moon.png');

export default function TodoScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const tasks = useQuery(api.tasks.getTasks, { filter: filter });
  const updateOrder = useMutation(api.tasks.updateOrder);
  const clearCompleted = useMutation(api.tasks.clearCompleted);
  const { themeMode, setThemeMode, isDark, theme } = useTheme();
  
  const { width } = useWindowDimensions();
  const isDesktop = width > 600; 

  const handleDragEnd = async ({ data: reorderedTasks }: { data: Doc<'tasks'>[] }) => {
    const tasksToUpdate = reorderedTasks.map((task, index) => ({
      id: task._id, order: index,
    }));
    try {
      await updateOrder({ tasks: tasksToUpdate });
    } catch (e) {
      console.error('Failed to update task order', e);
    }
  };

  const tasksLeft = tasks?.filter((t) => !t.completed).length ?? 0;

  const bgImage = isDesktop
    ? (isDark ? bgDesktopDark : bgDesktopLight)
    : (isDark ? bgMobileDark : bgMobileLight);
    
  const themeIcon = isDark ? iconSun : iconMoon;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContainer>
        <StyledImageBackground source={bgImage} resizeMode="cover" $isDesktop={isDesktop} />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ContentContainer $isDesktop={isDesktop}>
            
            <HeaderContainer>
              <TitleText>TODO</TitleText>
              <Pressable onPress={() => setThemeMode(isDark ? 'light' : 'dark')}>
                <ThemeIcon source={themeIcon} />
              </Pressable>
            </HeaderContainer>

            <TaskInput />

            <ListContainer>
              {tasks === undefined ? (
                <ActivityIndicator size="large" color={theme.brightBlue} style={{ marginTop: 40 }}/>
              ) : (
                <DraggableFlatList
                  data={tasks}
                  keyExtractor={(item) => item._id}
                  onDragEnd={handleDragEnd}
                  dragItemOverflow={true}
                  renderItem={({ item, drag, isActive }: RenderItemParams<Doc<'tasks'>>) => (
                    <ScaleDecorator>
                      <TaskItem task={item} drag={drag} isActive={isActive}/>
                    </ScaleDecorator>
                  )}
                  ListEmptyComponent={
                    <EmptyListText>
                      {filter === 'all' ? 'No tasks yet. Add one!' : `No ${filter} tasks.`}
                    </EmptyListText>
                  }
                  ListFooterComponent={() => (
                    <FooterContainer>
                      <FooterText>{tasksLeft} items left</FooterText>
                      
                      {isDesktop && (
                        <FilterButtons filter={filter} setFilter={setFilter} />
                      )}
                      
                      <Pressable onPress={() => clearCompleted({})}>
                        <FooterText>Clear Completed</FooterText>
                      </Pressable>
                    </FooterContainer>
                  )}
                />
              )}
            </ListContainer>

            {!isDesktop && (
              <MobileFilterContainer>
                <FilterButtons filter={filter} setFilter={setFilter} />
              </MobileFilterContainer>
            )}

            <DragDropText>
              Drag and drop to reorder list
            </DragDropText>
            
          </ContentContainer>
        </SafeAreaView>
      </AppContainer>
    </GestureHandlerRootView>
  );
}