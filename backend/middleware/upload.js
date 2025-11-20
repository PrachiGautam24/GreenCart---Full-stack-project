import multer from 'multer';
import path from 'path';

// Configure multer storage to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images with enhanced validation
const fileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = /jpeg|jpg|png|gif|webp/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  // Check MIME type
  const allowedMimeTypes = /image\/(jpeg|jpg|png|gif|webp)/;
  const mimetype = allowedMimeTypes.test(file.mimetype);

  // Both extension and MIME type must match
  if (extname && mimetype) {
    // Additional check: ensure extension matches MIME type
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeExt = file.mimetype.split('/')[1];
    
    // Normalize jpg/jpeg
    const normalizedExt = ext === '.jpg' ? 'jpeg' : ext.substring(1);
    const normalizedMime = mimeExt === 'jpg' ? 'jpeg' : mimeExt;
    
    if (normalizedExt === normalizedMime) {
      cb(null, true);
    } else {
      cb(new Error('File extension does not match file type'), false);
    }
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configure multer with enhanced security
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files per request
    fields: 10, // Maximum 10 non-file fields
    parts: 15 // Maximum 15 parts (files + fields)
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File size exceeds 5MB limit',
          code: 'FILE_TOO_LARGE'
        }
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Too many files. Maximum 5 files allowed',
          code: 'TOO_MANY_FILES'
        }
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Unexpected field in file upload',
          code: 'UNEXPECTED_FIELD'
        }
      });
    }
  }
  
  // Other errors (like file type validation)
  if (err) {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message || 'File upload error',
        code: 'UPLOAD_ERROR'
      }
    });
  }
  
  next();
};

export default upload;
