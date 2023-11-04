import { HandlerContext, Status } from "$fresh/server.ts";
import { getSyncServer } from "../../common/sync-server.ts";

export const handler = (req: Request, _ctx: HandlerContext): Response => {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const bad_response = (reply: string | null = null) => new Response(reply, { status: Status.BadRequest });
    if (name === null) return bad_response('?name=____');
    const sync_server = getSyncServer(name);
    if (sync_server === null) return bad_response('no session named ' + name);
    if (req.method === 'POST') {
        req.json().then(data => sync_server.send(data));
        return new Response(null, { status: Status.NoContent });
    } else
        return new Response(sync_server.getReadableStream().pipeThrough(new TextEncoderStream()), {
            headers: { "Content-Type": "text/event-stream" }
        });
};
