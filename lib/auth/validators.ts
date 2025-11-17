import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
});

export const passwordResetSchema = z.object({
  email: z.string().email(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2).max(120),
  avatar_url: z.string().url().optional().or(z.literal("")),
  subscription_tier: z.enum(["free", "pro", "enterprise"]),
});

