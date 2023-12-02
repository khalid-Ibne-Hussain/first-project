import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

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
  // set generate id automatically
  userData.id = await generateStudentId(admissionSemester);

  //   set manually generated id
  // userData.id = "2030100001";

  //   create a user
  const newUser = await User.create(userData);

  //   create a student // Object.keys(result)= it makes result array & helps to check the length
  if (Object.keys(newUser).length) {
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //ref id

    const neStudent = await Student.create(payload);
    return neStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
