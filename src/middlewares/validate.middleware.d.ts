import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
export declare const validate: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middleware.d.ts.map