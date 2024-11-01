import React from 'react';
import { View, Image, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image as ImageType } from '../../types/image';
import { IMAGE_BASE_URL } from '../../constants/config';

interface ImageCardProps {
  image: ImageType;
  onPress?: () => void;
  index: number;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress, index }) => {
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
});
