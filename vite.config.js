import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  root: path.resolve(__dirname, "./"),
  build: {
    outDir: "build",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: false,
    strictPort: true,
    allowedHosts: ["frontend", "10.21.17.97", "joineazy.com", "www.joineazy.com"],
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      host: "192.168.31.50",
      port: 3000,
      clientPort: 3000,
    },
    // Remove the proxy configuration since we're using absolute URLs
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.31.50:8000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  define: {
    // Remove the conflicting API_BASE_URL definition
    // __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api/v1'),
  },
}));
