import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semester",
    route: AcademicSemesterRoutes,
  },
  // For Academic Faculty
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  //for academic department
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/users", UserRoutes);
// router.use("/students", StudentRoutes);

export default router;
