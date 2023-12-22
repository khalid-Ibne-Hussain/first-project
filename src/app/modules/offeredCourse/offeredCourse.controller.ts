import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );
  console.log("clicker con1");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course is created successfully !",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
};
