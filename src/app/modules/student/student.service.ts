// import { TStudent } from "./student.interface";
import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

// 2nd logic (get)
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };
  //now find the query related value

  // {'name.firstName': {$regex: query.searchTerm, $option: 'i'[-->for case insensitive]}}
  /*
  const studentSearchableFields = ["email", "name.firstName", "presentAddress"];
  let searchTerm = "";

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });
*/
  /*
  // filtering
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

  excludeFields.forEach((el) => delete queryObj[el]);
  // console.log(query,queryObj);
  console.log({ query }, { queryObj });

  const filterQuery = searchQuery
    .find(queryObj)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
*/

  /*
  // sorting
  let sort = "-createdAt";

  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);
*/
  /*
//pagination
  let page = 1;
  let skip = 0;
  let limit = 1;

  if (query.limit) {
    limit = Number(query.limit);
  }

  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);
*/
  /*
  const limitQuery = paginateQuery.limit(limit);

  // field limiting
  let fields = "-__v";

  // fields: 'name,email';
  // fields: 'name email';

  if (query.fields) {
    fields = (query.fields as string).split(",").join(" ");
    console.log({ fields });
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
  */

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

// 3rd logic
const getSingleStudentFromDB = async (id: string) => {
  // console.log(id);

  const result = await Student.findById(id)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  // console.log(result);
  return result;
};

// __________ DYnamically update
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  /*
  guardian:{
    fatherOccupation:"Teacher"
  }
  guardian.fatherOccupation = Teacher
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  // console.log(modifiedUpdatedData);

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true, //for new data
    runValidators: true, // jno again mongoose validator on kore dey
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete!");
  }
};

export const StudentsServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};

/*
// const createStudentIntoDB =async(student: Student)=>{
//    const result= await StudentModel.create(student); // build in static method by mongoose

//    return result;

// };

// _____________ custom instance method
// const createStudentIntoDB =async(studentData: TStudent)=>{

// const student = new Student(studentData); //create an instance

// if(await student.isUserExists(studentData.id)){
//     throw new Error('User already exists!');
// }

// const result = await student.save();//built in instance method

// return result;

// };

// _________________________custom static method
// const createStudentIntoDB =async(studentData: TStudent)=>{

//     if (await Student.isUserExists(studentData.id)){
//         throw new Error('User already exists!')
//        }

//        const result= await Student.create(studentData); // build in static method by mongoose

//        return result;
//     };
// {email: {$regex: query.searchTerm, $option: 'i'[-->for case insensitive]}}
  // {presentAddress: {$regex: query.searchTerm, $option: 'i'[-->for case insensitive]}}
*/
