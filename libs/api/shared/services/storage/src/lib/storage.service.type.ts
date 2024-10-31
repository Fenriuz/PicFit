import { GetObjectCommandOutput, ListObjectsV2CommandOutput, DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

export interface KeyParam {
  key: string;
}

export interface UploadFileParams extends KeyParam {
  body: Buffer;
}

export interface IStorageService {
  uploadFile(params: UploadFileParams): Promise<string>;
  getFile(params: KeyParam): Promise<GetFileResponse>;
  getAllFiles(params?: GetAllFilesOptions): Promise<ListFilesResponse>;
  fileExists(params: KeyParam): Promise<boolean>;
  deleteFile(params: KeyParam): Promise<DeleteFileResponse>;
}

export interface GetAllFilesOptions {
  prefix?: string;

  startAfter?: string;

  maxKeys?: number;
}

export type GetFileResponse = GetObjectCommandOutput;
export type DeleteFileResponse = DeleteObjectCommandOutput;
export type ListFilesResponse = ListObjectsV2CommandOutput;
