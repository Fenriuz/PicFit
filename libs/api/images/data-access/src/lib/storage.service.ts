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

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService<{ awsImagesBucketName: string }>) {
    this.s3Client = new S3Client();
    this.bucket = this.configService.getOrThrow('awsImagesBucketName');
  }

  private s3Client: S3Client;
  private readonly bucket: string;

  async uploadFile(key: string, body: Buffer): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      //   ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);
    return key;
  }

  async getFile(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await this.s3Client.send(command);
  }

  async getAllFiles(options?: {
    prefix?: string;
    startAfter?: string;
    maxKeys?: number;
  }): Promise<ListObjectsV2CommandOutput> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: options?.prefix,
      StartAfter: options?.startAfter ? `images/original/${options.startAfter}` : undefined,
      MaxKeys: options?.maxKeys,
    });

    return await this.s3Client.send(command);
  }

  async fileExists(key: string): Promise<boolean> {
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

  async deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await this.s3Client.send(command);
  }
}
