import { z } from "zod";

export const productVerificationFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must not exceed 200 characters"),
  slug: z.string().optional(),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(500, "Short description must not exceed 500 characters"),
  description: z.string().optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
  mediaUrl: z.string().url("Invalid media URL"),
  mediaType: z.enum(["VIDEO", "PDF", "ARTICLE", "EXTERNAL_LINK"], {
    error: "Invalid media type",
  }),
  category: z.enum(["COSMETICS", "SKIN_CARE", "HEALTH", "PERFUME", "ELECTRONICS", "OTHERS"], {
    error: "Invalid category",
  }),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
  seoTitle: z.string().max(60, "SEO title must not exceed 60 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO description must not exceed 160 characters").optional().or(z.literal("")),
  seoKeywords: z.string().optional().or(z.literal("")),
});

export type ProductVerificationFormData = z.infer<typeof productVerificationFormSchema>;