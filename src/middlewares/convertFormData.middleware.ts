import { Request, Response, NextFunction } from "express";

const NUMBER_FIELDS = [
  "price",
  "costPrice",
  "cost_price",
  "stock",
  "minStock",
  "min_stock",
  "categoryId",
  "category_id",
  "unitId",
  "unit_id",
];

export const convertFormData = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    for (const key of Object.keys(req.body)) {
      if (NUMBER_FIELDS.includes(key) && typeof req.body[key] === "string") {
        const trimmed = req.body[key].trim();
        if (trimmed === "") {
          req.body[key] = undefined;
        } else {
          const num = Number(trimmed);
          req.body[key] = isNaN(num) ? req.body[key] : num;
        }
      }
    }
  }
  next();
};
