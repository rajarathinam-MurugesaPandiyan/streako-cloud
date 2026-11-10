import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: process.env.BASE_URL || (command === 'serve' ? '/' : '/streako-cloud/'),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
}))
