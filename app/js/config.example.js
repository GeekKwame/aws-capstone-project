/**
 * Student Study Planner — configuration template
 *
 * Copy this file to config.js and set your S3 bucket URL:
 *   cp app/js/config.example.js app/js/config.js
 *
 * Public S3 URL format:
 *   https://<bucket-name>.s3.<region>.amazonaws.com/<file-name>
 */
const CONFIG = {
  S3_ASSET_BASE: 'https://YOUR_BUCKET_NAME.s3.us-east-1.amazonaws.com',
  ASSETS: {
    logo: 'Azubi.png'
  },
  STORAGE_KEY: 'studyPlannerTasks',
  THEME_KEY: 'studyPlannerTheme'
};
