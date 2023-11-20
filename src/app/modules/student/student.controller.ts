import { Request, Response } from "express";
import { StudentsServices } from "./student.service";

const createStudent = async(req: Request, res:Response)=>{
try{
    const {student: studentData} = req.body;
    // will call service func to send this data 
    const result = await StudentsServices.createStudentIntoDB(studentData);

    // send response
    res.status(200).json({
        success:true,
        message: 'Student is created successfully',
        data: result,
    })
}
catch (err){
    console.log(err);
}  
};

// 2nd logic after service
const getAllStudents =async (req:Request, res:Response) => {
    try{
        const result = await StudentsServices.getAllStudentsFromDB();
        // send response
        res.status(200).json({
        success:true,
        message: 'Students are retrived successfully',
        data: result,
    })
    }
    catch(err){
        console.log(err);
    }
}

const getSingleStudent =async (req:Request, res:Response) => {
    try{
        // const studentId = req.params.studentId;
        const {studentId} = req.params;

        const result = await StudentsServices.getSingleStudentFromDB(studentId);
        // send response
        res.status(200).json({
        success:true,
        message: 'Student is retrieved successfully',
        data: result,
    })
    }
    catch(err){
        console.log(err);
    }
}



export const StudentControllers ={
    createStudent,
    getAllStudents,
    getSingleStudent,
}