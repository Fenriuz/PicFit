import React from 'react';
import { View, Image, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image as ImageType } from '@pic-fit/api/shared/types';

interface ImageCardProps {
  image: ImageType;
  onPress?: () => void;
  onDelete?: (key: string) => void;
  index: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress, onDelete, index }) => {
  const { width } = useWindowDimensions();

  const cardWidth = width / 2 - 16;
  const imageHeight = (cardWidth * 3) / 4;

  const targetWidth = Math.round(cardWidth / 100) * 100;
  const targetHeight = Math.round(imageHeight / 100) * 100;

  const imageUrl = `${IMAGE_BASE_URL}/${targetWidth}x${targetHeight}/${image.key}`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.imageCard, pressed && styles.pressed]}>
      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.thumbnail} resizeMode="cover" />
        {onDelete && (
          <Pressable
            onPress={() => onDelete(image.key)}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </Pressable>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            Image {index + 1}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  imageCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '100%',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
