import { View, type ViewProps } from 'react-native';
import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppViewProps = ViewProps & {
  bg?: ThemeColor;
};

/** Themed view — defaults to the app background color, or pass `bg` for any theme color. */
export function AppView({ style, bg, ...rest }: AppViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[bg ?? 'background'] }, style]} {...rest} />;
}
