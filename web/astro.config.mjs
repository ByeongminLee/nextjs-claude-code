import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ByeongminLee.github.io',
  base: '/nextjs-claude-code',
  integrations: [tailwind()],
});
