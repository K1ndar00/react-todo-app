import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

//Vite公式ドキュメント：https://ja.vite.dev/config/
export default defineConfig({
    plugins: [react()],
})