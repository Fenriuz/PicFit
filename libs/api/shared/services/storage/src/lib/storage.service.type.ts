import { GetObjectCommandOutput, ListObjectsV2CommandOutput, DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

export interface KeyParam {
  key: string;
}

export interface UploadFileParams extends KeyParam {
  body: Buffer;
}

export interface IStorageService {
  uploadFile(params: UploadFileParams): Promise<string>;
  getFile(params: KeyParam): Promise<GetObjectCommandOutput>;
  getAllFiles(params?: GetAllFilesOptions): Promise<ListObjectsV2CommandOutput>;
  fileExists(params: KeyParam): Promise<boolean>;
  deleteFile(params: KeyParam): Promise<DeleteObjectCommandOutput>;
}

export interface GetAllFilesOptions {
  prefix?: string;

  startAfter?: string;

  maxKeys?: number;
}
