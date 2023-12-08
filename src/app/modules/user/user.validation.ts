import { z } from "zod";

const userValidationSchema = z.object({
  //   id: z.string(),//auto generate hobe
  password: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .max(50, { message: "Password can not be more than 20 char" })
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};

//   needsPasswordChange: z.boolean().optional(), // admin theke asbe na , aita model er maddhome set hobe.
//   role: z.enum(["student", "faculty", "admin"]), // endpoint theke set hobe
//   status: z.enum(["in-progress", "blocked"]).default("in-progress"), // model theke asbe
//   isDeleted: z.boolean().optional().default(false), // model theke asbe
