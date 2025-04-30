import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // Proxy pour éviter les problèmes de CORS et de certificats
    proxy: {
      '/api': {
        target: 'https://project.localhost:8443',
        changeOrigin: true,
        secure: false, // Désactive la vérification du certificat SSL
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
});
function AutoImport(): import("vite").PluginOption {
  throw new Error("Function not implemented.");
}

