import { Student } from "./student.interface";
import {StudentModel} from "../student.model";

const createStudentIntoDB =async(student: Student)=>{

   const result= await StudentModel.create(student);
   return result;

};

// 2nd logic (get)
const getAllStudentsFromDB = async()=>{
    const result = await StudentModel.find();
    return result;
}

// 3rd logic 
const getSingleStudentFromDB = async(id:string)=>{
    const result = await StudentModel.findOne({id});
    return result;
}

export const StudentsServices ={
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
}