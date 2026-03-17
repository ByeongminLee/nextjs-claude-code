import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ByeongminLee.github.io',
  base: '/nextjs-claude-code',
  vite: {
    plugins: [tailwindcss()],
  },
});
