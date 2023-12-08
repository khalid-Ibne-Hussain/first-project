/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { StudentsServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// higher order function

const getSingleStudent = catchAsync(async (req, res) => {
  // const studentId = req.params.studentId;
  const { id } = req.params;
  const result = await StudentsServices.getSingleStudentFromDB(id);
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
  // console.log(req.query);
  const result = await StudentsServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students are retrieved successfully",
    data: result,
  });
  //--
});

const updateStudent = catchAsync(async (req, res) => {
  // const studentId = req.params.studentId;
  const { id } = req.params;
  const { student } = req.body;

  const result = await StudentsServices.updateStudentIntoDB(id, student);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is updated successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  // const studentId = req.params.studentId;
  const { id } = req.params;

  const result = await StudentsServices.deleteStudentFromDB(id);

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
  updateStudent,
  deleteStudent,
};

/**
 // send response
  // res.status(200).json({
  //   success: true,
  //   message: "Students are retrieved successfully",
  //   data: result,
  // });


  //  catch (err) {
  // res.status(500).json({
  //   success: false,
  //   message: err.message || "something went wrong",
  //   error: err,
  // });
  // next(err);
  // }


 */
