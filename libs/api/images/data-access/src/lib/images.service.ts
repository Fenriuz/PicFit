import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { StorageService } from '@pic-fit/api/shared/services/storage';

@Injectable()
export class ImagesService {
  constructor(private readonly storageService: StorageService) {}
  private readonly path = 'images';
  private readonly resizedPath = `${this.path}/resized`;
  private readonly originalPath = `${this.path}/original`;

  async uploadImage(image: Buffer, filename: string) {
    const key = `${this.originalPath}/${Date.now()}-${filename}`;

    await this.storageService.uploadFile({ key, body: image });
  }

  async getOriginalImage(key: string) {
    const fullKey = `${this.originalPath}/${key}`;

    return this.storageService.getFile({ key: fullKey });
  }

  async getOriginalImages(lastKey?: string, limit = 12) {
    const files = await this.storageService.getAllFiles({
      prefix: this.originalPath + '/',
      startAfter: lastKey,
      maxKeys: limit,
    });

    return {
      items:
        files.Contents?.map((content) => ({
          key: content.Key?.replace(this.originalPath + '/', ''),
          lastModified: content.LastModified,
        })) || [],
      hasMore: files.IsTruncated,
      lastKey: files.Contents?.[files.Contents.length - 1]?.Key?.replace(this.originalPath + '/', ''),
    };
  }

  async getResizedImage(key: string, width: number, height: number) {
    const fullKey = `${this.resizedPath}/${width}x${height}/${key}`;

    const exists = await this.storageService.fileExists({ key: fullKey });
    if (!exists) {
      const originalImage = await this.getOriginalImage(key);
      const bufferOriginalImage = await originalImage.Body?.transformToByteArray();
      const resizedImage = await sharp(bufferOriginalImage).resize(width, height).toBuffer();

      await this.storageService.uploadFile({ key: fullKey, body: resizedImage });
    }

    return this.storageService.getFile({ key: fullKey });
  }

  async deleteImage(key: string) {
    const fullKey = `${this.originalPath}/${key}`;
    await this.storageService.deleteFile({ key: fullKey });
  }
}
