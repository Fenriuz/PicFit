import { Injectable } from '@nestjs/common';
import sharp = require('sharp');

import { StorageService } from '@pic-fit/api/shared/services/storage';
import {
  GetOriginalImagesParams,
  GetResizedImageParams,
  ImageUploadParams,
  IImagesService,
  KeyParam,
  ImageListItem,
} from './images.service.type';

@Injectable()
export class ImagesService implements IImagesService {
  constructor(private readonly storageService: StorageService) {}
  private readonly path = 'images';
  private readonly resizedPath = `${this.path}/resized`;
  private readonly originalPath = `${this.path}/original`;

  async uploadImage({ image, filename }: ImageUploadParams) {
    const key = `${this.originalPath}/${Date.now()}-${filename}`;

    await this.storageService.uploadFile({ key, body: image });
  }

  async getOriginalImage({ key }: KeyParam) {
    const fullKey = `${this.originalPath}/${key}`;

    return this.storageService.getFile({ key: fullKey });
  }

  async getOriginalImages({ lastKey, limit = 12 }: GetOriginalImagesParams) {
    const files = await this.storageService.getAllFiles({
      prefix: this.originalPath + '/',
      startAfter: lastKey ? this.originalPath + '/' + lastKey : undefined,
      maxKeys: limit,
    });

    const items: ImageListItem[] =
      files.Contents?.map((content) => ({
        key: content.Key?.replace(this.originalPath + '/', '') ?? '',
        lastModified: content.LastModified,
      })) ?? [];

    return {
      items,
      hasMore: files.IsTruncated ?? false,
      lastKey: files.Contents?.[files.Contents.length - 1]?.Key?.replace(this.originalPath + '/', ''),
    };
  }

  async getResizedImage({ key, width, height }: GetResizedImageParams) {
    const fullKey = `${this.resizedPath}/${width}x${height}/${key}`;

    const exists = await this.storageService.fileExists({ key: fullKey });
    if (!exists) {
      const originalImage = await this.getOriginalImage({ key });
      const bufferOriginalImage = await originalImage.Body?.transformToByteArray();
      const image = sharp(bufferOriginalImage);

      const resizedImage = await image.resize(width, height).toBuffer();

      await this.storageService.uploadFile({ key: fullKey, body: resizedImage });
    }

    return this.storageService.getFile({ key: fullKey });
  }

  async deleteImage({ key }: KeyParam) {
    const fullKey = `${this.originalPath}/${key}`;
    await this.storageService.deleteFile({ key: fullKey });
  }
}
