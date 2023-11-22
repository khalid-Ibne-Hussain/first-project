import { Request, Response } from "express";
import { StudentsServices } from "./student.service";
// import Joi from 'Joi';
// import studentValidationSchema from "./student.validation";
// import {z} from 'zod';
import StudentValidationSchema from "./student.validation";



const createStudent = async(req: Request, res:Response)=>{
try{

    // creating a schema validation using zod___________
    const {student: studentData} = req.body;

    // data validation using zod
    const zodParsedData = StudentValidationSchema.parse(studentData)

    // data validating using joi_________________________
    // const {error,value} = studentValidationSchema.validate(studentData);
    // console.log({error},{value});

    // will call service func to send this data 
    const result = await StudentsServices.createStudentIntoDB(zodParsedData);


// joi part_________________
    // if(error){
    //     res.status(500).json({
    //         success:false,
    //         message: 'something went wrong',
    //         error: error.details, //[or ES6] error,
    //     });
    // }

    // send response
    res.status(200).json({
        success:true,
        message: 'Student is created successfully',
        data: result,
    })
}
catch (err: any){
    // console.log(err);
    res.status(500).json({
        success:false,
        message: err.message||'something went wrong',
        error: err,
    });
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
    catch(err:any){
        res.status(500).json({
            success:false,
            message: err.message||'something went wrong',
            error: err,
        });
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
    });
    }
    catch(err:any){
        // console.log(err);
        res.status(500).json({
            success:false,
            message: err.message||'something went wrong',
            error: err,
        });
       
    }
};


const deleteStudent =async (req:Request, res:Response) => {
    try{
        // const studentId = req.params.studentId;
        const {studentId} = req.params;

        const result = await StudentsServices.deleteStudentFromDB(studentId);
        // send response
        res.status(200).json({
        success:true,
        message: 'Student is deleted successfully',
        data: result,
    });
    }
    catch(err:any){
        // console.log(err);
        res.status(500).json({
            success:false,
            message: err.message||'something went wrong',
            error: err,
        });
       
    }
};


export const StudentControllers ={
    createStudent,
    getAllStudents,
    getSingleStudent,
    deleteStudent,
}