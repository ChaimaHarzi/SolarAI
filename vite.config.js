import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" permet d'ouvrir la version compilée depuis n'importe quel dossier ou hébergement
export default defineConfig({
  plugins: [react()],
  base: "./",
});
