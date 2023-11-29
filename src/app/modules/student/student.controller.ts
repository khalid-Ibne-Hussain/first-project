/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { StudentsServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// higher order function

const getSingleStudent = catchAsync(async (req, res) => {
  // const studentId = req.params.studentId;
  const { studentId } = req.params;
  const result = await StudentsServices.getSingleStudentFromDB(studentId);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is retrieved successfully",
    data: result,
  });
});

// 2nd logic after service
const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentsServices.getAllStudentsFromDB();
  // send response
  // res.status(200).json({
  //   success: true,
  //   message: "Students are retrieved successfully",
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students are retrieved successfully",
    data: result,
  });
  //  catch (err) {
  // res.status(500).json({
  //   success: false,
  //   message: err.message || "something went wrong",
  //   error: err,
  // });
  // next(err);
  // }
});

const deleteStudent = catchAsync(async (req, res) => {
  // const studentId = req.params.studentId;
  const { studentId } = req.params;

  const result = await StudentsServices.deleteStudentFromDB(studentId);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is deleted successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
