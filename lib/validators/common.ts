import { z } from "zod";

export const PhoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" });

export const IntegerSchema = z.coerce
  .number()
  .int()
  .min(0, { message: "Number must be positive" });

export const FloatSchema = z.coerce
  .number()
  .min(0, { message: "Value must be positive" });
