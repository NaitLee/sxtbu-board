import { defineConfig } from "$fresh/server.ts";
import { Config } from "./common/utils.tsx";

export default defineConfig({
    server: {
        hostname: Config.host ? Config.host.string() : void 0,
        port: Config.port ? Config.port.int() : 8000,
        cert: Config.cert ? Deno.readTextFileSync(Config.cert.string()) : void 0,
        key: Config.key ? Deno.readTextFileSync(Config.key.string()) : void 0,
    },
});
