import { z } from "zod";

export const NewCryptoFormSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .max(100, "نام طولانی تر از 100 کاراکتر نمیتواند باشد"),
  symbol: z
    .string()
    .min(1, "نماد الزامی است")
    .max(10, "نماد طولانی تر از 10 کاراکتر نمیتواند باشد")
    .toUpperCase(),
  image: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  description: z
    .string()
    .max(500, "توضیحات طولانی تر از 500 کاراکتر نمیتواند باشد")
    .optional(),
  website: z
    .string()
    .url("آدرس وب‌سایت معتبر نیست")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("آدرس توییتر معتبر نیست")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("آدرس گیت‌هاب معتبر نیست")
    .optional()
    .or(z.literal("")),
});

export type NewCryptoFormData = z.infer<typeof NewCryptoFormSchema>;
