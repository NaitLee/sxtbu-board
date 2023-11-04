import { Status, type HandlerContext } from "$fresh/server.ts";
import { randcode } from "../common/utils.tsx";

export const handler = (req: Request, _ctx: HandlerContext): Response => {
    const name = randcode(6);
    return new Response(null, {
        status: Status.Found,
        headers: { 'Location': '/' + name }
    });
}
