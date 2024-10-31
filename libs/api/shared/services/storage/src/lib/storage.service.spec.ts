import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { GetFileResponse } from './storage.service.type';

describe('StorageService', () => {
  let service: StorageService;
  const s3Mock = mockClient(S3Client);

  const mockBucketName = 'test-bucket';
  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue(mockBucketName),
  };

  beforeEach(async () => {
    s3Mock.reset();

    const module = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockParams = {
        key: 'test-key',
        body: Buffer.from('test'),
      };

      s3Mock.on(PutObjectCommand).resolves({});

      const result = await service.uploadFile(mockParams);

      expect(result).toBe(mockParams.key);
      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: mockBucketName,
        Key: mockParams.key,
        Body: mockParams.body,
      });
    });
  });

  describe('getFile', () => {
    it('should get file successfully', async () => {
      const mockParams = { key: 'test-key' };
      const mockResponse = { Body: 'test-content' } as unknown as GetFileResponse;

      s3Mock.on(GetObjectCommand).resolves(mockResponse);

      const result = await service.getFile(mockParams);

      expect(result).toEqual(mockResponse);
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: mockBucketName,
        Key: mockParams.key,
      });
    });
  });

  describe('getAllFiles', () => {
    it('should list files without options', async () => {
      const mockResponse = { Contents: [] };

      s3Mock.on(ListObjectsV2Command).resolves(mockResponse);

      const result = await service.getAllFiles();

      expect(result).toEqual(mockResponse);
      expect(s3Mock).toHaveReceivedCommandWith(ListObjectsV2Command, {
        Bucket: mockBucketName,
      });
    });

    it('should list files with options', async () => {
      const mockOptions = {
        prefix: 'test/',
        startAfter: 'test-file',
        maxKeys: 10,
      };
      const mockResponse = { Contents: [] };

      s3Mock.on(ListObjectsV2Command).resolves(mockResponse);

      const result = await service.getAllFiles(mockOptions);

      expect(result).toEqual(mockResponse);
      expect(s3Mock).toHaveReceivedCommandWith(ListObjectsV2Command, {
        Bucket: mockBucketName,
        Prefix: mockOptions.prefix,
        StartAfter: mockOptions.startAfter,
        MaxKeys: mockOptions.maxKeys,
      });
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      const mockParams = { key: 'test-key' };

      s3Mock.on(HeadObjectCommand).resolves({});

      const result = await service.fileExists(mockParams);

      expect(result).toBe(true);
      expect(s3Mock).toHaveReceivedCommandWith(HeadObjectCommand, {
        Bucket: mockBucketName,
        Key: mockParams.key,
      });
    });

    it('should return false when file does not exist', async () => {
      const mockParams = { key: 'non-existent-key' };
      const notFoundError = new S3ServiceException({
        name: 'NotFound',
        $metadata: { httpStatusCode: 404 },
        $fault: 'client',
      });

      s3Mock.on(HeadObjectCommand).rejects(notFoundError);

      const result = await service.fileExists(mockParams);

      expect(result).toBe(false);
    });

    it('should throw error when S3 error occurs', async () => {
      const mockParams = { key: 'test-key' };
      const s3Error = new S3ServiceException({
        name: 'InternalError',
        $metadata: { httpStatusCode: 500 },
        $fault: 'client',
      });

      s3Mock.on(HeadObjectCommand).rejects(s3Error);

      await expect(service.fileExists(mockParams)).rejects.toThrow(s3Error);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const mockParams = { key: 'test-key' };
      const mockResponse = { DeleteMarker: true };

      s3Mock.on(DeleteObjectCommand).resolves(mockResponse);

      const result = await service.deleteFile(mockParams);

      expect(result).toEqual(mockResponse);
      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: mockBucketName,
        Key: mockParams.key,
      });
    });
  });
});
