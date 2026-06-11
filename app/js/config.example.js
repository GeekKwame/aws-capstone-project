/**
 * MyCloudApp — Runtime configuration example template
 *
 * Copy this file to config.js and populate it with your actual AWS resource identifiers:
 * cp app/js/config.example.js app/js/config.js
 *
 * STATIC assets (images, fonts, large files) are served from S3 via CloudFront.
 * DYNAMIC app shell (HTML, CSS, core JS) is served from EC2 via ALB.
 */
const AppConfig = Object.freeze({
  // CloudFront distribution domain (e.g. https://d1234abcdef.cloudfront.net)
  cdnDomain: "https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",

  // S3 bucket name (used for path construction)
  s3Bucket: "mycloudapp-static-assets-YOUR_ACCOUNT_ID",

  // Base path prefix inside the S3 bucket for static assets
  staticAssetPrefix: "/assets",

  // Application metadata
  appName: "MyCloudApp",
  version: "1.0.0",
  environment: "production",
});
