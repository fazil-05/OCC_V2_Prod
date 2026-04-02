import { z } from "zod";

const indianPhoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    collegeName: z.string().min(2, "College name must be at least 2 characters").optional(),
    phoneNumber: z
      .string()
      .regex(indianPhoneRegex, "Enter a valid Indian phone number")
      .transform((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length > 10 ? digits.slice(-10) : digits;
      })
      .optional(),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number"),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().optional(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  collegeName: z.string().min(2, "College name is required"),
  phoneNumber: z
    .string()
    .regex(indianPhoneRegex, "Enter a valid Indian phone number")
    .transform((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length > 10 ? digits.slice(-10) : digits;
    }),
  bio: z.string().max(280, "Bio must be 280 characters or less").optional().or(z.literal("")),
  city: z.string().max(80, "City is too long").optional().or(z.literal("")),
  graduationYear: z
    .union([z.number().int().min(2024).max(2035), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : undefined)),
});

export const joinClubSchema = z.object({
  clubId: z.string().cuid(),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().cuid(),
});

export const gigApplicationSchema = z.object({
  gigId: z.string().cuid(),
});

export const postCreateSchema = z.object({
  clubId: z.string().min(1),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).max(4).optional(),
  caption: z.string().max(2000).optional(),
  content: z.string().max(5000).optional(),
  type: z.string().optional(),
});

export const clubHeaderRegisterSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    collegeName: z.string().min(2),
    clubSlug: z.string().min(2),
    experience: z.string().min(10),
    instagramHandle: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const referralValidateSchema = z.object({
  code: z.string().min(4),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
