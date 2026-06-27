import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3),

  shortDescription: z.string().min(10),

  content: z.string().min(20),

  thumbnail: z.string().optional(),

  banner: z.string().optional(),

  category: z.string().min(1),

  contentType: z.enum(["ARTICLE", "VIDEO"]),

  tags: z.string().optional(),

  featured: z.boolean().default(false),

  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;