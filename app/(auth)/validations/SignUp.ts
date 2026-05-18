import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
  name: z.string().min(1, "Full name is required").max(60, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots and underscores"),
  birthdayMonth: z.string().min(1, "Month is required"),
  birthdayDay: z.string().min(1, "Day is required"),
  birthdayYear: z.string().min(1, "Year is required"),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d+$/, "Code must contain digits only"),
});

export type SignUpType = z.infer<typeof signUpSchema>;
export type SignUpVerificationCodeType = z.infer<typeof verificationCodeSchema>;
