import { Status, type HandlerContext } from "$fresh/server.ts";
import { INDEX_SPECIFY_SESSION_NAME, SESSION_NAME_LEN, randcode } from "../common/utils.tsx";
import Home from "./[name].tsx";

export const handler = (req: Request, ctx: HandlerContext): Response | Promise<Response> => {
    if (INDEX_SPECIFY_SESSION_NAME) {
        const name = randcode(SESSION_NAME_LEN);
        return new Response(null, {
            status: Status.Found,
            headers: { 'Location': '/' + name }
        });
    } else return ctx.render();
}

export default Home;
