import { API_BASE_URL } from '../constants/config';
import { Image } from '../types/image';

interface ImagesResponse {
  items: Image[];
  hasMore: boolean;
  lastKey: string;
}

export class ImageService {
  static async getImages(lastKey?: string): Promise<ImagesResponse> {
    try {
      const params = new URLSearchParams();
      if (lastKey) params.set('lastKey', lastKey);

      const response = await fetch(`${API_BASE_URL}/images?${params.toString()}`);

      const data = await response.json();

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
}
