import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {
  const isUserExists = await User.findOne({ id: payload?.id });
  console.log(payload);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  //   check user is already deleted
  const isDeleted = isUserExists?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }
  //   check user is blocked or not
  const userStatus = isUserExists?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //   check password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password not matched!");
  }
  //   access granted: send AccessToken , RefreshToken
  return {};
};

export const AuthServices = {
  loginUser,
};
