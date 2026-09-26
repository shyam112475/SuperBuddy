import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/use-theme';

export type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const theme = useTheme();
  const initials = getInitials(name);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size }]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size, backgroundColor: theme.infoSurface },
      ]}
    >
      <AppText variant="bodySemiBold" style={{ color: theme.info, fontSize: size * 0.38 }}>
        {initials}
      </AppText>
    </View>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#00000010',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
