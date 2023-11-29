import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(`i am an army & my name is ${name}`);
    //   console.log(req.body);
    //   validation check_________
    try {
      await schema.parseAsync({
        body: req.body,
      });

      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
