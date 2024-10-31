export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  awsImagesBucketName: process.env.AWS_IMAGES_BUCKET_NAME,
});
