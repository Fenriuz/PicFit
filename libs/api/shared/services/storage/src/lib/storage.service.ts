import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  GetObjectCommandOutput,
  S3ServiceException,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from '@pic-fit/api/shared/types';
import { IStorageService, GetAllFilesOptions, UploadFileParams, KeyParam } from './storage.service.type';

@Injectable()
export class StorageService implements IStorageService {
  constructor(private configService: ConfigService<ConfigVariables>) {
    this.s3Client = new S3Client();
    this.bucket = this.configService.getOrThrow('awsImagesBucketName');
  }

  private s3Client: S3Client;
  private readonly bucket: string;

  async uploadFile(params: UploadFileParams): Promise<string> {
    const { key, body } = params;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      //   ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);
    return key;
  }

  async getFile(params: KeyParam): Promise<GetObjectCommandOutput> {
    const { key } = params;
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await this.s3Client.send(command);
  }

  async getAllFiles(options?: GetAllFilesOptions): Promise<ListObjectsV2CommandOutput> {
    const { prefix, startAfter, maxKeys } = options ?? {};
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      StartAfter: startAfter ? `images/original/${startAfter}` : undefined,
      MaxKeys: maxKeys,
    });

    return await this.s3Client.send(command);
  }

  async fileExists(params: KeyParam): Promise<boolean> {
    const { key } = params;
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode !== 404) {
        throw error;
      }
      return false;
    }
  }

  async deleteFile(params: KeyParam): Promise<DeleteObjectCommandOutput> {
    const { key } = params;
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await this.s3Client.send(command);
  }
}
