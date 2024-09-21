import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import svgTemplate from "./svg-template";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",  // allows importing any `svg` file as a React component
      svgrOptions: {
        template: svgTemplate, // loads the custom svgr template
      },
    }),],
})
