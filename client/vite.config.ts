import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
       '@': path.resolve(__dirname,"./src"),
       '@components': path.resolve(__dirname,"./src/components"),
       '@pages': path.resolve(__dirname,"./src/pages"),
       '@utilities': path.resolve(__dirname,"./src/utilities"),
       '@api': path.resolve(__dirname,"./src/api"),
       '@schemas': path.resolve(__dirname,"./src/schemas"),
    }
  }
})
