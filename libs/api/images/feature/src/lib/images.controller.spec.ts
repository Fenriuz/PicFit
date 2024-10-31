import { Test } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from '@pic-fit/api/images/data-access';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';
import { GetFileResponse } from '@pic-fit/api/shared/services/storage';

describe('ImagesController', () => {
  let controller: ImagesController;
  let imagesService: jest.Mocked<ImagesService>;

  beforeEach(async () => {
    const mockImagesService = {
      uploadImage: jest.fn().mockImplementation(),
      getResizedImage: jest.fn().mockImplementation(),
      getOriginalImage: jest.fn().mockImplementation(),
      getOriginalImages: jest.fn().mockImplementation(),
      deleteImage: jest.fn().mockImplementation(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    controller = moduleRef.get<ImagesController>(ImagesController);
    imagesService = moduleRef.get(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        fieldname: 'file',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: Buffer.from('test').length,
        stream: new Readable(),
        destination: '',
        path: '',
        filename: 'test.jpg',
      };
      const expectedInput = {
        image: mockFile.buffer,
        filename: mockFile.originalname,
      };

      await controller.uploadImage(mockFile);

      expect(imagesService.uploadImage).toHaveBeenCalledWith(expectedInput);
    });
  });

  describe('getResizedImage', () => {
    it('should return a resized image', async () => {
      const mockByteArray = new Uint8Array([1, 2, 3]);
      const mockResponse = {
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(mockByteArray),
        },
      } as unknown as GetFileResponse;
      imagesService.getResizedImage.mockResolvedValue(mockResponse);

      const result = await controller.getResizedImage('100x100', 'test.jpg');

      expect(imagesService.getResizedImage).toHaveBeenCalledWith({
        key: 'test.jpg',
        width: 100,
        height: 100,
      });
      expect(result).toBeInstanceOf(StreamableFile);
    });

    it('should throw NotFoundException when image not found', async () => {
      imagesService.getResizedImage.mockResolvedValue({
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(undefined),
        },
      } as unknown as GetFileResponse);

      await expect(controller.getResizedImage('100x100', 'test.jpg')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getImage', () => {
    it('should return an original image', async () => {
      const mockByteArray = new Uint8Array([1, 2, 3]);

      jest.spyOn(imagesService, 'getOriginalImage').mockResolvedValue({
        Body: {
          transformToByteArray: () => Promise.resolve(mockByteArray),
        },
      } as unknown as GetFileResponse);

      const expected = await controller.getImage('test.jpg');

      expect(imagesService.getOriginalImage).toHaveBeenCalledWith({
        key: 'test.jpg',
      });
      expect(expected).toBeDefined();

      expect(expected).toBeInstanceOf(StreamableFile);
    });

    it('should throw NotFoundException when image not found', async () => {
      imagesService.getOriginalImage.mockResolvedValue({
        Body: {
          transformToByteArray: () => Promise.resolve(undefined),
        },
      } as unknown as GetFileResponse);

      await expect(controller.getImage('test.jpg')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOriginalImages', () => {
    it('should return list of original images', async () => {
      const mockResponse = {
        items: [{ key: 'test.jpg', lastModified: new Date() }],
        hasMore: false,
        lastKey: 'test.jpg',
      };
      imagesService.getOriginalImages.mockResolvedValue(mockResponse);

      const result = await controller.getOriginalImages('lastKey', '10');

      expect(imagesService.getOriginalImages).toHaveBeenCalledWith({
        lastKey: 'lastKey',
        limit: 10,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should use default limit when not provided', async () => {
      await controller.getOriginalImages();

      expect(imagesService.getOriginalImages).toHaveBeenCalledWith({
        lastKey: undefined,
        limit: 12,
      });
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      controller.deleteImage('test.jpg');

      expect(imagesService.deleteImage).toHaveBeenCalledWith({
        key: 'test.jpg',
      });
    });
  });
});
