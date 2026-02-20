import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err: any) => err._errors)
        .flat();

      return res.status(400).json({
        message: flatErrors.join(", "),
      });
    }

    next();
  };
};
