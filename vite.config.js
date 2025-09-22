import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      '@': '/src',
    },
  },
  base: '/', // اسم ریپازیتوری رو بذار همینجا
});
