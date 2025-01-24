import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// import {VitePWA} from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import path from 'path';

// const vitePwa = VitePWA({
//   registerType: 'autoUpdate',
//   devOptions: {
//     enabled: true,
//   },
//   strategies: 'injectManifest',
//   srcDir: 'src',
//   filename: 'sw.ts',
//   manifest: {
//     name: 'CTT YSTU',
//     short_name: 'CTT',
//     description: 'CTT site',
//     theme_color: '#ffffff',
//
//     icons: [
//       {
//         src: 'android-chrome-192x192.png',
//         sizes: '192x192',
//         type: 'image/png'
//       },
//       {
//         src: 'android-chrome-512x512.png',
//         sizes: '512x512',
//         type: 'image/png'
//       }
//     ],
//     screenshots: [
//       {
//         "src": "desktop-screenshot.png",
//         "sizes": "2752x1564",
//         "type": "image/gif",
//         "form_factor": "wide",
//         "label": "Application"
//       },
//       {
//         "src": "mobile-screenshot.png",
//         "sizes": "746x1246",
//         "type": "image/gif",
//         "label": "Application"
//       },
//
//     ]
//   },
//   injectManifest: {
//     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
//     maximumFileSizeToCacheInBytes: 5 * 1024 ** 2,
//   },
// })

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  plugins: [svgr({
    include: "**/*.svg?react",
  }), react()],
  // }), react(), vitePwa],
});
