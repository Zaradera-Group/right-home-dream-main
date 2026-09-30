import { z } from "zod";

export const contactInterestValues = [
  "Buying property",
  "Renting",
  "Investing",
  "Listing a property",
  "Partnership",
] as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "Name must not exceed 80 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(120, "Email must not exceed 120 characters."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .refine(
      (value) => !value || /^\+?[0-9\s()-]{7,20}$/.test(value),
      "Please enter a valid phone number.",
    ),
  interest: z.enum(contactInterestValues),
  message: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters.")
    .max(2000, "Message must not exceed 2,000 characters."),
  website: z.string().max(120),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const chatPromptSchema = z
  .string()
  .trim()
  .min(2, "Please enter a question.")
  .max(1000, "Please keep your question under 1,000 characters.");
