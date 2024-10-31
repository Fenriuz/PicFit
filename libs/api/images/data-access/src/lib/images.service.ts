import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ImagesService {
  // constructor() {}

  async uploadImage(image: Express.Multer.File) {
    const region = process.env['AWS_REGION'];
    console.log(region);
    const s3Client = new S3Client({});

    const bucketName = 'sw-alexvalle-images-bucket';
    const key = `${Date.now()}-${image.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: image.buffer,
    });

    await s3Client.send(command);
  }
}
