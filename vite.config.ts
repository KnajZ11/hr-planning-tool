// rsschool-cv\vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({  
  base: '/rsschool-cv/', 
  
  build: {
    outDir: 'dist',    
    sourcemap: true,     
    target: 'esnext', 
  },
  server: {
    port: 3000,
    open: true,
  },
});