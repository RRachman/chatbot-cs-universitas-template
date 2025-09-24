import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig(() => ({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true, // accept connections from network (0.0.0.0)
        port: 5173,
        strictPort: false,
        hmr: {
            host: "backend-chatbot.test", // the hostname your browser uses
            protocol: "ws", // websocket for HMR
            port: 5173,
        },
    },
}));
