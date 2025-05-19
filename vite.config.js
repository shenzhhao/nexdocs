import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nexdocs/', // 设置基本路径为仓库名
  build: {
    assetsInlineLimit: 0, // 禁用小资源内联，确保所有字体文件都作为单独的文件处理
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public', // 确保public目录中的文件被正确复制
});