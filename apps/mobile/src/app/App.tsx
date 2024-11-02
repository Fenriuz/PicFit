import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImagesListScreen } from '@pic-fit/client/mobile/components';

const queryClient = new QueryClient();

export default function ImageResizerApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImagesListScreen />
    </QueryClientProvider>
  );
}
