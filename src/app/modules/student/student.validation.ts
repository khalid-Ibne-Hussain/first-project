import { z } from 'zod';


// Define a Zod schema for the userName sub-document
const userNameValidationSchema = z.object({
    firstName: z.string().min(1).max(20),
    middleName: z.string().min(0).max(20),
    lastName: z.string().min(1).max(20),
  });
  
  // Define a Zod schema for the guardian sub-document
  const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
  });
  
  // Define a Zod schema for the localGuardian sub-document
  const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
  });
  
  // Define a Zod schema for the entire Student document
  export const StudentValidationSchema = z.object({
    id: z.string(),
    name: userNameValidationSchema,
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: z.string(),
    email: z.string().email(),
    contactNo: z.string(),
    emergencyContactNo: z.string(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    presentAddress: z.string(),
    permanentAddress: z.string(),
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: z.string().optional(),
    isActive: z.enum(['active', 'blocked']).default('active'),
  });
  
  export default StudentValidationSchema;