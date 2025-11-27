import { z } from "zod";
import { EmailSchema, NameSchema } from "./auth";

export const BusinessSchema = z.object({
  businessName: NameSchema,
  ownerName: NameSchema,
  businessEmail: EmailSchema,
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  experience: z.coerce
    .number()
    .min(0, { message: "Experience cannot be negative" })
    .max(50, { message: "Experience cannot exceed 50 years" }),
});
