import { Schema, model } from "mongoose";
// import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
    max: [20, "Max length 20 char."],
    validate: {
      validator: function (value: string) {
        const firstName = value.charAt(0).toUpperCase() + value.slice(1); // Name
        return firstName === value;
      },
      message: `{VALUE} is not in capitalize format`,
    },
  },
  middleName: {
    type: String,
    trim: true,
    max: [20, "Max length 20 char."],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true,
    max: [20, "Max length 20 char."],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father name is required."],
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father occupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father contact is required"],
  },
  motherName: {
    type: String,
    required: [true, "Mother name is required"],
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother occupation is required."],
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother contact is required."],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// 2. schema
// ---------------------------------
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, "Id is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User Id is required"],
      unique: true,
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      // enum: ["male","female","other"],
      enum: {
        values: ["male", "female", "other"],
        message:
          "The gender field can only be the following: 'male','female', or 'other'.",
        // message:"{VALUE} is not valid",
      },
      required: true,
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImg: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual________________
studentSchema.virtual("fullName").get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// *************middleware*************
// pre save middleware/hook: will work on create(), save()

// query middleware___________________
studentSchema.pre("find", function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("findOne", function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("aggregate", function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom static method____________
studentSchema.statics.isUserExists = async function (id) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

// 3. model
export const Student = model<TStudent, StudentModel>("Student", studentSchema);
