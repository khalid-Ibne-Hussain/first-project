/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { StudentRoutes } from "./app/modules/student/student.route";
import { UserRoutes } from "./app/modules/user/user.route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import router from "./app/routes";
const app: Application = express();
// const port = 3000

// parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ["http://localhost:5173"] }));

// application routes
app.use("/api/v1", router);
// app.use("/api/v1/students", StudentRoutes);
// app.use("/api/v1/users", UserRoutes);

const test = async (req: Request, res: Response) => {
  // Promise.reject();
  res.send("Hello World!");
};

app.get("/", test);

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;

// console.log(process.cwd());//current dir show kore
