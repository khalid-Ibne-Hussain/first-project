import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester name --> code check

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid semester code!");
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error("Invalid Semester code!");
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};

// _____________________________
//   type TAcademicSemesterNameCodeMapper ={
//     Winter: "01",
//     Summer: "02",
//     Fall: "03",
//   };

// transfer to the interface ***
//   type TAcademicSemesterNameCodeMapper = {
//     [key: string]: string; // ts map type : it helps if u add another semester like [Autumn: '04'], u need not to edit type.
//   };

// transfer to the constant file ***
// const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
//     Winter: "01",
//     Summer: "02",
//     Fall: "03",
//   };
