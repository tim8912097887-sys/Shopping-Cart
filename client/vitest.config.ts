import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()], 
  test: {
    globals: true,
    environment: "jsdom",
    
    // Increase the timeout for CI environments
    testTimeout: 10000,
    
    // Match only actual test files
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    
    // Ensure target all files inside these folders
    exclude: [
      ...configDefaults.exclude,
      "src/stores/**/*.{ts,tsx}", 
      "src/schemas/**/*.{ts,tsx}",
      "src/test/**/*"
    ],

    coverage: {
      provider: "v8",
      reporter: ["html", "text", "json"], 
      // Enforce a quality floor
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      exclude: [
        ...configDefaults.exclude,
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/stores/**",
        "src/schemas/**",
        "src/test/**"
      ],
    },

    // Better alias handling
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname,"./src/components"),
      '@pages': path.resolve(__dirname,"./src/pages"),
      '@utilities': path.resolve(__dirname,"./src/utilities"),
      '@api': path.resolve(__dirname,"./src/api"),
      '@schemas': path.resolve(__dirname,"./src/schemas"),
      '@stores': path.resolve(__dirname,"./src/stores"),
      '@mock': path.resolve(__dirname,"./src/mock")
    },

    setupFiles: ["./src/test/setup.ts"],
    
    // Clear the console between runs for better DX
    clearMocks: true,
    restoreMocks: true,
  }
})