import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Image as ImageType } from '@pic-fit/api/shared/types';

interface ImageModalProps {
  image: ImageType | null;
  visible: boolean;
  onClose: () => void;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

export const ImageModal: React.FC<ImageModalProps> = ({ image, visible, onClose }) => {
  if (!image) return null;
  const imageUrl = `${IMAGE_BASE_URL}/${image.key}`;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="contain" />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
