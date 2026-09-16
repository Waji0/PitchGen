import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'
import { inngest } from '#/integrations/inngest/client'
import { deriveTitle, requireUserId } from '../lib/server-helpers'
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from '../types/schemas'

import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'


export const createPresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createPresentationInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        title: deriveTitle(data.prompt),
        prompt: data.prompt,
        slideCount: data.slideCount,
        style: data.style,
        tone: data.tone,
        layout: data.layout,
        status: 'GENERATING',
      },
    })

    try {
      await inngest.send({
        name: 'presentation/generate',
        data: { presentationId: presentation.id },
      })
    } catch {
      await prisma.presentation.update({
        where: { id: presentation.id },
        data: { status: 'FAILED' },
      })
      throw new Error('Could not start generation. Please try again.')
    }

    return presentation
  })

export const updatePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => updatePresentationInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const { id, ...patch } = data
    const existing = await prisma.presentation.findFirst({ where: { id, userId } })
    if (!existing) throw new Error('Not found')
    return prisma.presentation.update({ where: { id }, data: patch })
  })

export const deletePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => presentationIdInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const existing = await prisma.presentation.findFirst({ where: { id: data.id, userId } })
    if (!existing) throw new Error('Not found')
    await prisma.presentation.delete({ where: { id: data.id } })
    return { ok: true as const }
  })

export const regeneratePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => presentationIdInputSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const existing = await prisma.presentation.findFirst({ where: { id: data.id, userId } })
    if (!existing) throw new Error('Not found')

    await prisma.presentation.update({
      where: { id: data.id },
      data: { status: 'GENERATING' },
    })
    await inngest.send({
      name: 'presentation/generate',
      data: { presentationId: data.id },
    })
    return { ok: true as const }
  })

// 1. Update a single slide's text
export const updateSlide = createServerFn({ method: 'POST' })
  .validator((d: unknown) => z.object({ id: z.string(), title: z.string(), content: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireUserId()
    return prisma.slide.update({
      where: { id: data.id },
      data: { title: data.title, content: data.content },
    })
  })

// 2. Reorder slides (takes an array of IDs in the new order)
export const reorderSlides = createServerFn({ method: 'POST' })
  .validator((d: unknown) => z.object({ presentationId: z.string(), slideIds: z.array(z.string()) }).parse(d))
  .handler(async ({ data }) => {
    await requireUserId()
    // Use a transaction to update all slide orders simultaneously
    const updates = data.slideIds.map((id, index) =>
      prisma.slide.update({ where: { id }, data: { order: index } })
    )
    await prisma.$transaction(updates)
    return { ok: true as const }
  })

// 3. AI Refine (Rewrite a slide based on user instructions)
export const refineSlide = createServerFn({ method: 'POST' })
  .validator((d: unknown) => z.object({ slideId: z.string(), instruction: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireUserId()
    const slide = await prisma.slide.findUnique({ where: { id: data.slideId } })
    if (!slide) throw new Error('Slide not found')

    const { object } = await generateObject({
      model: google(process.env.GEMINI_MODEL ?? 'gemini-3.6-flash'),
      schema: z.object({ title: z.string(), content: z.string() }),
      prompt: `Rewrite this presentation slide based on this instruction: "${data.instruction}".
Current Title: ${slide.title}
Current Content: ${slide.content}
Rules: Keep it concise, use newlines for bullet points, and ensure the tone matches a professional presentation.`,
    })

    return prisma.slide.update({
      where: { id: data.slideId },
      data: { title: object.title, content: object.content },
    })
  })