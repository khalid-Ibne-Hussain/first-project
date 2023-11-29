// import { NextFunction, Request, RequestHandler, Response } from "express";
// import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};

//____________________________________________
// createStudent type declare [RequestHandler from express]
// async (req: Request,res: Response,next: NextFunction)
// const createStudent: RequestHandler = async (req, res, next) => {
//   try {
//     // creating a schema validation using zod___________
//     const { password, student: studentData } = req.body;

//     const result = await UserServices.createStudentIntoDB(
//       password,
//       studentData
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Student is created successfully",
//       data: result,
//     });
//   } catch (err) {
//     // console.log(err);
//     next(err);
//   }
// };
