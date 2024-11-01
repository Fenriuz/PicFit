import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageService } from '../services/imageService';
import { Image } from '../types/image';
import { Alert, Platform } from 'react-native';

interface ImagesResponse {
  items: Image[];
  hasMore: boolean;
  lastKey: string;
}

export const useImages = () => {
  return useInfiniteQuery<ImagesResponse, Error, InfiniteData<ImagesResponse>, string[], string | undefined>({
    queryKey: ['images'],
    queryFn: ({ pageParam }) => ImageService.getImages(pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastKey : undefined),
    initialPageParam: undefined,
  });
};

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ImageService.uploadImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: (error) => {
      if (Platform.OS === 'web') {
        window.confirm(`Error: ${error.message}`);
      } else {
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
      }
    },
  });
};
