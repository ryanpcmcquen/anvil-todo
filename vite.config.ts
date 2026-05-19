import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import anvil from "@anvil-di/anvil-unplugin/vite";
import { bellowsCodegen } from "@anvil-di/bellows";
import { bellowsOpenApi } from "@anvil-di/bellows-openapi";

export default defineConfig({
  plugins: [
    react(),
    anvil({
      entries: ["server/src/app-component.ts", "server/src/spec-component.ts"],
      preBuild: [
        bellowsCodegen({ entry: "server/src", openapiTitle: "Todo API" }),
      ],
      postBuild: [
        bellowsOpenApi({ entry: "server/src" }),
      ],
    }),
  ],
  server: {
    port: 5173,
  },
});
