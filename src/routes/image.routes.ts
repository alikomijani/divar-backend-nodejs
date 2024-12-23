import multer from 'multer';
import { uploadController } from '@/controllers/images.controllers';
import express from 'express';
import { UPLOAD_PATH } from '@/configs/app.configs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1],
    );
  },
});
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};
const upload = multer({
  fileFilter,
  storage,
  limits: {
    fieldNameSize: 192,
    fileSize: 1024 * 1024 * 2, // 2 MB
  },
});

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), uploadController);

export default imageRouter;
