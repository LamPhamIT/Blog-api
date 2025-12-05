export const UploadConstants = {
  FOLDER_NAME: 'blog-uploads',

  ALLOWED_FORMATS: ['jpg', 'png', 'jpeg', 'webp'],

  ALLOWED_MIME_PREFIX: 'image/',

  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
} as const;
