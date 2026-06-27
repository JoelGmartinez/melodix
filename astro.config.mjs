import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import path from 'path';

export default defineConfig({
  integrations: [react(), AstroPWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Melodix',
      short_name: 'Melodix',
      description: 'Tu reproductor de música personal',
      start_url: '/',
      display: 'standalone',
      background_color: '#121212',
      theme_color: '#121212',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp}'],
    },
  })],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
