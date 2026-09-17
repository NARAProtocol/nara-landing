import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "route-rewrites",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/meme" || req.url === "/meme/") {
            res.writeHead(302, { Location: "/" });
            res.end();
            return;
          }
          if (req.url === "/swap" || req.url === "/swap/") {
            res.writeHead(302, { Location: "/swap.html" });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        swap: path.resolve(__dirname, "swap.html"),
      },
    },
  },
  define: {
    global: "globalThis",
  },
  server: { port: 5180, host: true },
});

