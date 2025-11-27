import { z } from "zod";

// Reusable validators
export const EmailSchema = z
  .string()
  .email({ message: "Enter a valid email address" });

export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Must contain one special character" });

export const NameSchema = z
  .string()
  .min(3, { message: "Name must be at least 3 characters long" });

// Signup Schema
export const SignupSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

// Login Schema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});
