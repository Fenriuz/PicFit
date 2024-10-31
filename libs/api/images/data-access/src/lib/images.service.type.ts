import { GetFileResponse } from '@pic-fit/api/shared/services/storage';

export interface ImageUploadParams {
  image: Buffer;
  filename: string;
}

export interface GetResizedImageParams {
  key: string;
  width: number;
  height: number;
}

export interface GetOriginalImagesParams {
  lastKey?: string;
  limit?: number;
}

export interface ImageListItem {
  key: string;
  lastModified: Date | undefined;
}

export interface ImageListResponse {
  items: ImageListItem[];
  hasMore: boolean;
  lastKey: string | undefined;
}

export interface KeyParam {
  key: string;
}

export interface IImagesService {
  uploadImage(params: ImageUploadParams): Promise<void>;
  getOriginalImage(params: KeyParam): Promise<GetFileResponse>;
  getOriginalImages(params: GetOriginalImagesParams): Promise<ImageListResponse>;
  getResizedImage(params: GetResizedImageParams): Promise<GetFileResponse>;
  deleteImage(params: KeyParam): Promise<void>;
}
