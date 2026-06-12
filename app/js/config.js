/**
 * App configuration — update S3_ASSET_BASE after uploading assets to your bucket.
 * Public S3 URL format: https://<bucket-name>.s3.<region>.amazonaws.com/<file-name>
 */
const CONFIG = {
  S3_ASSET_BASE: 'https://capstone-static-assets-azubi-610356897914-us-east-1-an.s3.us-east-1.amazonaws.com',
  ASSETS: {
    logo: 'Azubi.png'
  },
  STORAGE_KEY: 'studyPlannerTasks',
  THEME_KEY: 'studyPlannerTheme'
};
