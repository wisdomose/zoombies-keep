import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    netlify(),
  ],
  optimizeDeps: {
    include: ['detect-gpu'],
  },
  ssr: {
    noExternal: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/rapier',
      'detect-gpu',
    ],
  },
})

export default config
