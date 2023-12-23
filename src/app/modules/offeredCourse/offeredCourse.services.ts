import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  // check existence
  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration not found!"
    );
  }
  const academicSemester = isSemesterRegistrationExists.academicSemester;
  //-------
  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found!");
  }
  //-------
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found!");
  }
  //------
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
  }
  //-------
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }
  //   check the depart is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`
    );
  }
  //-------
  //   check the same course and same section in same registered semester is exist?
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`
    );
  }

  //   solve the problem: same teacher take classes in same time &  same day
  //   get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  /*
  assignedSchedules.forEach((schedule) => {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      throw new AppError(
        httpStatus.CONFLICT,
        `This faculty is not available at that time ! Choose other time or day.`
      );
    }
  });
  */
  //   console.log(hasTimeConflict(assignedSchedules, newSchedule));
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day.`
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const getAllOfferedCoursesFromDB = async () => {};

// update_____________________________________
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }
  //   get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day.`
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true, //updated doc given
  });
  return result;
};

// const getSingleOfferedCourseFromDB = async (id: string) => {};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  //   getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
