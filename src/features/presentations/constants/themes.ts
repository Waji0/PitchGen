export const THEMES = {
  MINIMAL: {
    bg: 'FFFFFF',
    titleColor: '111111',
    textColor: '333333',
    titleFont: 'Calibri',
    bodyFont: 'Calibri Light',
  },
  BOLD: {
    bg: '0F0F0F',
    titleColor: 'FFFFFF',
    textColor: 'CCCCCC',
    titleFont: 'Impact',
    bodyFont: 'Arial',
  },
  CORPORATE: {
    bg: '0B2447',
    titleColor: 'FFFFFF',
    textColor: 'A9B4C2',
    titleFont: 'Arial',
    bodyFont: 'Arial',
  },
  CREATIVE: {
    bg: 'F4F1BB',
    titleColor: 'E07A5F',
    textColor: '3D405B',
    titleFont: 'Georgia',
    bodyFont: 'Verdana',
  },
  ACADEMIC: {
    bg: 'F5F5DC',
    titleColor: '2C3E50',
    textColor: '34495E',
    titleFont: 'Times New Roman',
    bodyFont: 'Times New Roman',
  },
  DARK: {
    bg: '1A1A1D',
    titleColor: '4ECCA3',
    textColor: 'EEEEEE',
    titleFont: 'Courier New',
    bodyFont: 'Arial',
  }
} as const

export type ThemeKey = keyof typeof THEMES