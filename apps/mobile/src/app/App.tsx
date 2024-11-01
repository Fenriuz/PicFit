import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImagesListScreen } from '../screens/ImagesList';

const queryClient = new QueryClient();

export default function ImageResizerApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImagesListScreen />
    </QueryClientProvider>
  );
}
