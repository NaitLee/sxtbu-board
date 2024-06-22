import { type FreshContext } from "$fresh/server.ts";
import { INDEX_SPECIFY_SESSION_NAME, SESSION_NAME_LEN, randcode } from "../common/utils.tsx";
import Home from "./[name].tsx";

export const handler = (req: Request, ctx: FreshContext): Response | Promise<Response> => {
    if (INDEX_SPECIFY_SESSION_NAME) {
        const name = randcode(SESSION_NAME_LEN);
        return new Response(null, {
            status: 302,
            headers: { 'Location': '/' + name }
        });
    } else return ctx.render();
}

export default Home;
