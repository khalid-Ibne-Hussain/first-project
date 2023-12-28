import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-course",
  auth("admin"),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get(
  "/:id",
  auth("student", "faculty", "admin"),
  CourseControllers.getSingleCourse
);

router.get("/", CourseControllers.getAllCourses);

router.delete("/:id", CourseControllers.deleteCourse);

router.patch(
  "/:id",
  auth("admin"),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

// assign faculty to course
router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

// remove faculties from course
router.delete(
  "/:courseId/remove-faculties",
  auth("admin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse
);

export const CourseRoutes = router;
