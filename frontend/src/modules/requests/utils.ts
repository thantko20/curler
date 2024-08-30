import { z } from "zod"

export const multipartFormValueSchema = z.object({
  value: z.string(),
  valueType: z.enum(["text", "file"]),
  filename: z.string().optional(),
  mimeType: z.string().optional()
})
