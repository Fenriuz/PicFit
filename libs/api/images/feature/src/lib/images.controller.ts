import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  Delete,
  StreamableFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '@pic-fit/api/images/data-access';

@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 0.2 * 1024 * 1024, // 200KB in bytes
            message: (maxSize) => `File size is too large. Max size is ${maxSize / 1024 / 1024} MB`,
          }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/png|image\/webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uploadedImage = await this.imageService.uploadImage(file.buffer, file.originalname);
    return uploadedImage;
  }

  @Get(':dimensions/:filename')
  async getResizedImage(@Param('dimensions') dimensions: string, @Param('filename') filename: string) {
    const [width, height] = dimensions.split('x').map(Number);
    const image = await this.imageService.getResizedImage(filename, width, height);

    const byteArray = await image.Body?.transformToByteArray();
    if (!byteArray) {
      throw new NotFoundException('Image not found');
    }

    return new StreamableFile(byteArray);
  }
  @Get(':key')
  async getImage(@Param('key') key: string) {
    const image = await this.imageService.getOriginalImage(key);
    const byteArray = await image.Body?.transformToByteArray();
    if (!byteArray) {
      throw new NotFoundException('Image not found');
    }

    return new StreamableFile(byteArray);
  }

  @Get('')
  async getOriginalImages(@Query('lastKey') lastKey?: string, @Query('limit') limit = '12') {
    return this.imageService.getOriginalImages(lastKey, parseInt(limit));
  }

  @Delete(':key')
  async deleteImage(@Param('key') key: string) {
    return this.imageService.deleteImage(key);
  }
}
