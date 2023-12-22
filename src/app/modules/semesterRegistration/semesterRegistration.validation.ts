import { z } from "zod";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(SemesterRegistrationStatus as [string, ...string[]])]),
    // status:z.enum([...SemesterRegistrationStatus]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    // startDate: z.date(),
    // endDate: z.date(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});
const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    // status:z.enum([...SemesterRegistrationStatus]),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    // startDate: z.date(),
    // endDate: z.date(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
