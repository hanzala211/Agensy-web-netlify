import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/`
export default defineConfig({
  resolve: {
    alias: {
      "@agensy/components": path.resolve(
        __dirname,
        "./src/components/components.ts"
      ),
      "@agensy/hooks": path.resolve(__dirname, "./src/hooks/hooks.ts"),
      "@agensy/utils": path.resolve(__dirname, "./src/utils/utils.ts"),
      "@agensy/pages": path.resolve(__dirname, "./src/pages/pages.ts"),
      "@agensy/services": path.resolve(__dirname, "./src/services/services.ts"),
      "@agensy/context": path.resolve(__dirname, "./src/context/context.ts"),
      "@agensy/config": path.resolve(__dirname, "./src/config/config.ts"),
      "@agensy/constants": path.resolve(
        __dirname,
        "./src/constants/constants.ts"
      ),
      "@agensy/types": path.resolve(__dirname, "./src/types/types.ts"),
      "@agensy/layouts": path.resolve(__dirname, "./src/layouts/layouts.ts"),
      "@agensy/api": path.resolve(__dirname, "./src/api/api.ts"),
      "@agensy/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  plugins: [react()],
});
