import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

//TODO: fix the cookie error during build!

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@api": path.resolve(__dirname, "src/api"),
      "@queries": path.resolve(__dirname, "src/queries"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@apptypes": path.resolve(__dirname, "src/types"),
      "@flayva/validation": path.resolve(
        __dirname,
        "../../packages/validation"
      ),
      "@flayva/types": path.resolve(__dirname, "../../packages/types"),
      "@flayva/backend-types": path.resolve(
        __dirname,
        "../../packages/backend-types"
      ),
      "@flayva/constants": path.resolve(__dirname, "../../packages/constants"),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: ["/node_modules/"],
    },
  },
  optimizeDeps: {
    include: ["/cookie/"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
