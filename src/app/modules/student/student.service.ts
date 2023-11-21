import { TStudent } from "./student.interface";
import {Student} from "../student.model";

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
    const createStudentIntoDB =async(studentData: TStudent)=>{

        if (await Student.isUserExists(studentData.id)){
            throw new Error('User already exists!')
           }

           const result= await Student.create(studentData); // build in static method by mongoose        
        
           return result;
        };


// 2nd logic (get)
const getAllStudentsFromDB = async()=>{
    const result = await Student.find();
    return result;
}

// 3rd logic 
const getSingleStudentFromDB = async(id:string)=>{
    const result = await Student.findOne({id});
    return result;
}

export const StudentsServices ={
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
}