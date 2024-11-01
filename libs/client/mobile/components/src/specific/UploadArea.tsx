import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Animated, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface UploadAreaProps {
  onUpload: (formData: FormData) => void;
  isUploading: boolean;
  uploadAreaHeight: Animated.AnimatedInterpolation<string | number>;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, isUploading, uploadAreaHeight }) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleImageUpload = async () => {
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        if (Platform.OS !== 'web') {
          Alert.alert('Permission Required', 'Please grant access to your photo library to upload images.', [
            { text: 'OK' },
          ]);
        }
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      base64: true,
    });

    if (result.assets) {
      const asset = result.assets[0];
      if (!asset.fileName || !asset.base64) return;

      const formData = new FormData();
      const image = await fetch(`data:image/jpeg;base64,${asset.base64}`);
      const blob = await image.blob();
      formData.append('image', blob, asset.fileName);

      onUpload(formData);
    }
  };

  return (
    <TouchableOpacity onPress={handleImageUpload} disabled={isUploading}>
      <Animated.View style={[styles.container, { height: uploadAreaHeight }]}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#0284c7" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={40} color="#9CA3AF" />
            <Text style={styles.mainText}>Click to upload or drag and drop</Text>
            <Text style={styles.subText}>PNG, JPG or GIF (MAX. 800x400px)</Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
