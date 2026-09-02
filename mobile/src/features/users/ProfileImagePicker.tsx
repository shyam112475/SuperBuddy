import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { AppText, Avatar } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useUploadProfileImage } from './hooks';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ProfileImagePicker({
  currentImageUrl,
  fullName,
}: {
  currentImageUrl: string | null;
  fullName: string;
}) {
  const theme = useTheme();
  const [localError, setLocalError] = useState<string | null>(null);
  const { mutate, isPending, error } = useUploadProfileImage();

  async function handlePick() {
    setLocalError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setLocalError('Photo library access is needed to set a profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_SIZE_BYTES) {
      setLocalError('Image must be 5MB or smaller');
      return;
    }

    mutate({
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
    });
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePick} disabled={isPending} style={styles.avatarWrap}>
        <Avatar uri={currentImageUrl} name={fullName} size={88} />
        <View style={[styles.editBadge, { backgroundColor: theme.ink, borderColor: theme.background }]}>
          <Feather name={isPending ? 'loader' : 'camera'} size={14} color={theme.textOnInk} />
        </View>
      </Pressable>

      {(localError || error) && (
        <AppText variant="caption" color="danger" style={styles.errorText}>
          {localError ?? 'Upload failed. Please try again.'}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
