import { ConfigVariables } from '@pic-fit/api/shared/types';

export default (): ConfigVariables => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  awsImagesBucketName: process.env.AWS_IMAGES_BUCKET_NAME,
});
