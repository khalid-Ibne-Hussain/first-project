import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import mongoose from "mongoose";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  //   const user: NewUser = {};
  const userData: Partial<TUser> = {};

  // if pass is not given, use default password
  userData.password = password || (config.default_password as string);

  //   set student role
  userData.role = "student";

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Admission semester not found!");
  }
  // Transition rollback___________________________
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateStudentId(admissionSemester);

    //   create a user
    const newUser = await User.create([userData], { session }); //transaction e array hisebe data dite hoy

    //   create a user (transaction-1)
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //ref id

    // transaction - 2
    const newStudent = await Student.create([payload], { session });

    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
    }
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
  }
};

export const UserServices = {
  createStudentIntoDB,
};

// userData.id = await generateStudentId(admissionSemester);

//   //   set manually generated id
//   // userData.id = "2030100001";

//   //   create a user
//   const newUser = await User.create(userData);

//   //   create a student // Object.keys(result)= it makes result array & helps to check the length
//   if (Object.keys(newUser).length) {
//     // set id, _id as user
//     payload.id = newUser.id;
//     payload.user = newUser._id; //ref id

//     const newStudent = await Student.create(payload);
//     return newStudent;
//   }
// };
