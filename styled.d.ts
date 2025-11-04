import 'styled-components/native';

import { Theme } from './context/ThemeContext'; 

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}