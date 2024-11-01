import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageService } from '../services/imageService';
import { Image } from '@pic-fit/api/shared/types';
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

export const useImageDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => ImageService.deleteImage(key),
    onMutate: async (deletedKey) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['images'] });

      // Get the current query data
      const previousData = queryClient.getQueryData<InfiniteData<ImagesResponse>>(['images']);

      // Remove the deleted image from the cache and update the rest
      // don't need to refetch the data, because S3 needs some time to delete the image
      if (previousData) {
        queryClient.setQueryData<InfiniteData<ImagesResponse>>(['images'], {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.key !== deletedKey),
          })),
        });
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      console.log('Error', context);
      // If the mutation fails, restore the previous data
      if (context?.previousData) {
        queryClient.setQueryData(['images'], context.previousData);
      }
    },
  });
};
