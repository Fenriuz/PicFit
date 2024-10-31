import { Test } from '@nestjs/testing';
import { GetFileResponse, ListFilesResponse, StorageService } from '@pic-fit/api/shared/services/storage';
import { ImagesService } from './images.service';

const mockPngImage = [
  // PNG signature
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x52, 0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0b, 0x49, 0x44,
  0x41, 0x54, 0x08, 0xd7, 0x63, 0x60, 0x60, 0x60, 0x60, 0x00, 0x00, 0x00, 0x03, 0x00, 0x01, 0x20, 0x08, 0x6b, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
];

describe('ImagesService', () => {
  let service: ImagesService;
  let storageService: jest.Mocked<StorageService>;

  const mockStorageService = {
    uploadFile: jest.fn(),
    getFile: jest.fn(),
    getAllFiles: jest.fn(),
    fileExists: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = moduleRef.get<ImagesService>(ImagesService);
    storageService = moduleRef.get(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const params = {
        image: Buffer.from('test-image'),
        filename: 'test.jpg',
      };

      await service.uploadImage(params);

      expect(storageService.uploadFile).toHaveBeenCalledWith({
        key: expect.stringContaining('images/original/'),
        body: params.image,
      });
    });
  });

  describe('getOriginalImage', () => {
    it('should get original image successfully', async () => {
      const mockResponse = { Body: 'test-body' } as unknown as GetFileResponse;
      storageService.getFile.mockResolvedValue(mockResponse);

      const result = await service.getOriginalImage({ key: 'test.jpg' });

      expect(storageService.getFile).toHaveBeenCalledWith({
        key: 'images/original/test.jpg',
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getOriginalImages', () => {
    it('should get list of original images', async () => {
      const mockResponse: ListFilesResponse = {
        Contents: [
          { Key: 'images/original/test1.jpg', LastModified: new Date() },
          { Key: 'images/original/test2.jpg', LastModified: new Date() },
        ],
        IsTruncated: true,
        $metadata: {},
      };

      storageService.getAllFiles.mockResolvedValue(mockResponse);

      const result = await service.getOriginalImages({ limit: 10 });

      expect(storageService.getAllFiles).toHaveBeenCalledWith({
        prefix: 'images/original/',
        maxKeys: 10,
      });
      expect(result.items).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.lastKey).toBe('test2.jpg');
    });

    it('should handle empty response', async () => {
      const mockResponse: ListFilesResponse = {
        Contents: [],
        IsTruncated: false,
        $metadata: {},
      };
      storageService.getAllFiles.mockResolvedValue(mockResponse);

      const result = await service.getOriginalImages({});

      expect(result.items).toHaveLength(0);
      expect(result.hasMore).toBe(false);
      expect(result.lastKey).toBeUndefined();
    });
  });

  describe('getResizedImage', () => {
    it('should get resized image if it exists', async () => {
      const mockResponse = { Body: 'test-body' } as unknown as GetFileResponse;
      storageService.fileExists.mockResolvedValue(true);
      storageService.getFile.mockResolvedValue(mockResponse);

      const result = await service.getResizedImage({
        key: 'test.jpg',
        width: 100,
        height: 100,
      });

      expect(storageService.getFile).toHaveBeenCalledWith({
        key: 'images/resized/100x100/test.jpg',
      });
      expect(result).toBe(mockResponse);
    });

    it('should get original image if resized does not exist', async () => {
      // Create a 1x1 transparent PNG
      const mockByteArray = new Uint8Array(mockPngImage);
      const mockResponse = {
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(mockByteArray),
        },
      } as unknown as GetFileResponse;
      storageService.fileExists.mockResolvedValue(false);
      storageService.getFile.mockResolvedValue(mockResponse);

      const result = await service.getResizedImage({
        key: 'test.jpg',
        width: 100,
        height: 100,
      });

      expect(storageService.getFile).toHaveBeenCalledWith({
        key: 'images/original/test.jpg',
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      await service.deleteImage({ key: 'test.jpg' });

      expect(storageService.deleteFile).toHaveBeenCalledWith({
        key: 'images/original/test.jpg',
      });
    });
  });
});
