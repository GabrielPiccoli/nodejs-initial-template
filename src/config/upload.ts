import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";
import { slugify } from "@utils/slugify";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (req, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const lastIndexOfPeriod = file.originalname.lastIndexOf(".");
      const name = file.originalname.substring(0, lastIndexOfPeriod);
      const fileExtension = file.originalname.substring(lastIndexOfPeriod);
      const fileName = `${fileHash}-${slugify(name)}${fileExtension}`;

      return callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const filetypes =
      /jpeg|png|webp|svg|csv|msword|pdf|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return callback(null, true);
    }

    return callback(new AppError(`File ${file.mimetype} not allowed`));
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};
