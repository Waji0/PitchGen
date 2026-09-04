export const SLIDE_STYLES = [
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'BOLD', label: 'Bold' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'CREATIVE', label: 'Creative' },
  { value: 'ACADEMIC', label: 'Academic' },
  { value: 'DARK', label: 'Dark' },
] as const

export const TONE_OPTIONS = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'INSPIRATIONAL', label: 'Inspirational' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'PERSUASIVE', label: 'Persuasive' },
  { value: 'STORYTELLING', label: 'Storytelling' },
] as const

export const LAYOUT_OPTIONS = [
  { value: 'BALANCED', label: 'Balanced' },
  { value: 'IMAGE_HEAVY', label: 'Image Heavy' },
  { value: 'TEXT_HEAVY', label: 'Text Heavy' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'SPLIT', label: 'Split' },
] as const

export const PRESENTATION_TEMPLATES = [
  {
    id: 'startup-pitch',
    label: ' Startup Pitch',
    content: 'A pitch deck for an AI-powered presentation startup raising a pre-seed round',
    slides: 8,
    style: 'BOLD',
    tone: 'PERSUASIVE',
    layout: 'BALANCED',
  },
  {
    id: 'tech-talk',
    label: '💻 Tech Talk',
    content: 'A technical deep-dive into modern full-stack React architectures',
    slides: 10,
    style: 'DARK',
    tone: 'TECHNICAL',
    layout: 'TEXT_HEAVY',
  },
  {
    id: 'story',
    label: '📖 Story',
    content: 'The journey of how a small idea became a product used by thousands',
    slides: 7,
    style: 'CREATIVE',
    tone: 'STORYTELLING',
    layout: 'IMAGE_HEAVY',
  },
] as const