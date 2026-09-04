import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // 1. tanstackStart() automatically includes the Router plugin and route generator!
    // DO NOT add TanStackRouterVite() here.
    tanstackStart(),
    
    // 2. React's Vite plugin MUST come after start's vite plugin
    viteReact(),
    
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '#': `${import.meta.dirname}/src`,
    },
  },
})