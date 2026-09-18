import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      {
        name: "route-rewrites",
        configureServer(server) {
          server.middlewares.use((req: any, res: any, next: () => void) => {
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
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          swap: path.resolve(__dirname, "swap.html"),
        },
      },
    },
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
    },
    define: {
      global: "globalThis",
    },
    server: { port: 5180, host: "127.0.0.1" },
  };
});


