import { defineConfig } from 'vite';

export default defineConfig({
  base: '/TimeLoop/',
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kB
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      }
    }
  }
});
