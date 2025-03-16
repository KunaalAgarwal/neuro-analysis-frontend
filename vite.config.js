import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // base: "/neuro-analysis-frontend/", // Change to match your repo name
});
