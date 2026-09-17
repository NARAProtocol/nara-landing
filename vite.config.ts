import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "meme-rewrite",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/meme" || req.url === "/meme/") {
            res.writeHead(302, { Location: "/meme.html" });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  define: {
    global: "globalThis",
  },
  server: { port: 5180 },
});

