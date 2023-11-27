/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StudentsServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// import studentValidationSchema from "./student.validation";
// import {z} from 'zod';
// import StudentValidationSchema from "./student.validation";

// 2nd logic after service
const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   message: err.message || "something went wrong",
    //   error: err,
    // });
    next(err);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
