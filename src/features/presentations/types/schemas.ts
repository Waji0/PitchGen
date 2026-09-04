import { z } from 'zod'

export const styleSchema = z.enum([
  'MINIMAL', 'BOLD', 'CORPORATE', 'CREATIVE', 'ACADEMIC', 'DARK',
])
export const toneSchema = z.enum([
  'PROFESSIONAL', 'CASUAL', 'INSPIRATIONAL', 'TECHNICAL', 'PERSUASIVE', 'STORYTELLING',
])
export const layoutSchema = z.enum([
  'BALANCED', 'IMAGE_HEAVY', 'TEXT_HEAVY', 'MINIMAL', 'SPLIT',
])

export const createPresentationInputSchema = z.object({
  prompt: z.string().min(1).max(5000),
  slideCount: z.number().int().min(3).max(20),
  style: styleSchema,
  tone: toneSchema,
  layout: layoutSchema,
})

export const updatePresentationInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  prompt: z.string().min(1).max(5000).optional(),
  slideCount: z.number().int().min(3).max(20).optional(),
  style: styleSchema.optional(),
  tone: toneSchema.optional(),
  layout: layoutSchema.optional(),
})

export const presentationIdInputSchema = z.object({ id: z.string() })