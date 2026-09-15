import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { prisma } from '#/db'
import { inngest } from './client'

// ─── Structured Output Schema ────────────────────────────────────────────────
const slideSchema = z.object({
  title: z.string().describe('Slide title'),
  content: z
    .string()
    .describe('3-5 concise bullet points, separated by newlines (no bullet symbols)'),
  notes: z.string().optional().describe('Speaker notes for the presenter'),
  imagePrompt: z
    .string()
    .describe('Prompt for a professional illustration (clean style, NO text in image)'),
})

const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
})

// ─── Real AI Image Generation (zero-config, CORS-friendly) ──────────────────
export function buildSlideImageUrl(imagePrompt: string, seed: string) {
  const prompt = encodeURIComponent(imagePrompt.slice(0, 300))
  return `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true&seed=${seed}`
}

// ─── The Generation Worker ───────────────────────────────────────────────────
export const generatePresentation = inngest.createFunction(
  {
    id: 'generate-presentation',
    retries: 2,
    triggers: [{ event: 'presentation/generate' }],
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string }

    const presentation = await step.run('fetch-presentation', async () => {
      const p = await prisma.presentation.findUnique({
        where: { id: presentationId },
      })
      if (!p) throw new Error('Presentation not found')
      return p
    })

    await step.run('mark-generating', async () =>
      prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'GENERATING' },
      }),
    )

    const { slides } = await step.run('generate-slides-content', async () => {
      try {
//         const { object } = await generateObject({
//           // model: google('gemini-2.5-flash'),
//           model: google('gemini-3.6-flash'),
//           schema: slidesResponseSchema,
//           system: `You are an expert presentation designer. Create a compelling, concise presentation.
// Style: ${presentation.style}
// Tone: ${presentation.tone}
// Layout preference: ${presentation.layout}
// Rules:
// - Create exactly ${presentation.slideCount} slides
// - First slide is a title slide, last slide is a summary or call-to-action
// - Keep bullet points short and impactful
// - imagePrompt must describe a professional illustration with NO text`,
//           prompt: presentation.prompt,
//         })
        const { object } = await generateObject({
  // model: google('gemini-3.6-flash'),
  model: google(process.env.GEMINI_MODEL ?? 'gemini-3.6-flash'),
  schema: slidesResponseSchema,
  system: `You are an expert presentation designer. Create a compelling, concise presentation.
Style: ${presentation.style}
Tone: ${presentation.tone}
Layout preference: ${presentation.layout}
Rules:
- Create exactly ${presentation.slideCount} slides
- First slide is a title slide, last slide is a summary or call-to-action
- Keep bullet points short and impactful
- imagePrompt must describe a professional illustration with NO text`,
  prompt: presentation.prompt,
        })
        return object
      } catch (error) {
        // IMPROVEMENT: never leave the deck stuck in GENERATING
        await prisma.presentation.update({
          where: { id: presentationId },
          data: { status: 'FAILED' },
        })
        throw error
      }
    })

    await step.run('replace-slides', async () => {
      await prisma.slide.deleteMany({ where: { presentationId } })
      await prisma.slide.createMany({
        data: slides.map((s, i) => ({
          presentationId,
          order: i,
          title: s.title,
          content: s.content,
          notes: s.notes ?? null,
          imagePrompt: s.imagePrompt,
          imageUrl: buildSlideImageUrl(s.imagePrompt, `${presentationId}-${i}`),
          layoutType: i === 0 ? 'title' : presentation.layout.toLowerCase(),
        })),
      })
    })

    await step.run('mark-completed', async () =>
      prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'COMPLETED' },
      }),
    )

    return { success: true, slideCount: slides.length }
  },
)

export const functions = [generatePresentation]