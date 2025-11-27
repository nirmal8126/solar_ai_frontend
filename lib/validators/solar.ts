import { z } from "zod";

export const SolarSettingsSchema = z.object({
  customerType: z.enum(["Residential", "Commercial", "Both"]),

  pricePerKw: z.coerce
    .number()
    .min(1000, { message: "Price per kW must be at least ₹1000" })
    .max(150000, { message: "Enter a realistic price per kW" }),

  minKw: z.coerce
    .number()
    .min(0.5, { message: "Minimum system size must be at least 0.5 kW" }),

  maxKw: z.coerce
    .number()
    .min(1, { message: "Max system size must be at least 1 kW" }),

  subsidy: z.enum(["Yes", "No"]),

  gstType: z.enum(["0%", "5%", "12%", "18%"]),

  region: z.string().min(2, { message: "Region is required" }),
});
