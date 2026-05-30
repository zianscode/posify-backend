import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { BadRequestError } from "../shared/errors";

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;
      
      // Update request properties with validated/coerced values
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => ({
          field: err.path.slice(1).join("."), // strip first path element (body/query/params)
          msg: err.message,
        }));
        next(new BadRequestError("Validasi input gagal", errorDetails));
      } else {
        next(error);
      }
    }
  };
};
