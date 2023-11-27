import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  //   const user: NewUser = {};
  const userData: Partial<TUser> = {};
  // if pass is not given, use default password
  userData.password = password || (config.default_password as string);

  //   set student role
  userData.role = "student";

  //   set manually generated id
  userData.id = "2030100001";

  //   create a user
  const newUser = await User.create(userData); // build in static method by mongoose

  //   create a student // Object.keys(result)= it makes result array & helps to check the length
  if (Object.keys(newUser).length) {
    // set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; //ref id

    const neStudent = await Student.create(studentData);
    return neStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
