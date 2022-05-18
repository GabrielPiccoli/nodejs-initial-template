import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { MulterError } from "multer";
import swaggerUi from "swagger-ui-express";

import "../../container";
// import upload from "@config/upload";
import { AppError } from "@shared/errors/AppError";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";
import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors());

// app.use("/example", express.static(`${upload.tmpFolder}/example`));

app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({
    status: "error",
    message: `Internal server error ${err.message}`,
  });
});

export { app };
