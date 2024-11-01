import { Image } from '@pic-fit/api/shared/types';

interface ImagesResponse {
  items: Image[];
  hasMore: boolean;
  lastKey: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export class ImageService {
  static async getImages(lastKey?: string): Promise<ImagesResponse> {
    try {
      const params = new URLSearchParams();
      if (lastKey) params.set('lastKey', lastKey);

      const response = await fetch(`${API_BASE_URL}/images?${params.toString()}`);

      const data = await response.json();

      console.log(data);
      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch images');
    }
  }

  static async uploadImage(formData: FormData): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || 'Failed to upload image');
    }

    return response;
  }

  static async deleteImage(key: string): Promise<Response> {
    return await fetch(`${API_BASE_URL}/images/${key}`, { method: 'DELETE' });
  }
}
