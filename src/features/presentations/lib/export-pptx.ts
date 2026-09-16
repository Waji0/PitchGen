import pptxgen from 'pptxgenjs'
import { THEMES, type ThemeKey } from '../constants/themes'
import { imageToBase64 } from './image-utils'

type Slide = {
  title: string
  content: string
  notes?: string | null
  imageUrl?: string | null
}

export async function exportToPptx(
  title: string,
  slides: Slide[],
  style: ThemeKey
) {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'PitchGen'
  pptx.title = title

  const theme = THEMES[style] || THEMES.MINIMAL

  for (const slideData of slides) {
    const slide = pptx.addSlide()
    slide.background = { color: theme.bg }

    // 1. Add Image Background (if available)
    if (slideData.imageUrl) {
      const base64 = await imageToBase64(slideData.imageUrl)
      if (base64) {
        slide.addImage({
          data: base64,
          x: 0, y: 0, w: '100%', h: '100%',
          sizing: { type: 'cover', w: '100%', h: '100%' }
        })
        // Add a dark overlay for text readability
        // slide.addShape(pptx.shapes.RECTANGLE, {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: '100%',
          fill: { color: '000000', transparency: 60 }
        })
      }
    }

    // 2. Add Title
    slide.addText(slideData.title, {
      x: 0.5, y: 1.5, w: 9, h: 1.5,
      fontSize: 44,
      fontFace: theme.titleFont,
      color: theme.titleColor,
      bold: true,
      valign: 'middle',
    })

    // 3. Add Bullet Points
    const lines = slideData.content.split('\n').filter(Boolean)
    const bullets = lines.map(l => ({
      text: l.startsWith('•') ? l : `• ${l}`,
      options: {
        fontSize: 20,
        color: theme.textColor,
        bullet: false,
        breakLine: true,
      }
    }))
    
    slide.addText(bullets, {
      x: 0.5, y: 3.2, w: 9, h: 3.5,
      fontFace: theme.bodyFont,
      valign: 'top',
      paraSpaceAfter: 12,
    })

    // 4. Add Speaker Notes
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }

  const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`
  await pptx.writeFile({ fileName: filename })
}