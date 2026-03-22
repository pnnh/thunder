import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {viteStaticCopy} from "vite-plugin-static-copy";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    resolve: {
        alias: [
            {find: '@', replacement: path.resolve(__dirname, "./src")},
        ],
    },
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'dist/index.html',
                    dest: '.',
                    rename: '404.html'
                }
            ]
        })
    ],

    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || true,
    },
}));
