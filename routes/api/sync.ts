import { FreshContext } from "$fresh/server.ts";
import { getSyncServer } from "../../common/sync-server.ts";
import { SESSION_NAME_LEN } from "../../common/utils.tsx";

export const handler = (req: Request, _ctx: FreshContext): Response => {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const bad_response = (reply: string | null = null) => new Response(reply, { status: 400 });
    if (name === null) return bad_response(url.origin + url.pathname + '?name=' + '_'.repeat(SESSION_NAME_LEN));
    const sync_server = getSyncServer(name);
    if (sync_server === null) return bad_response('no such session. visit to create: ' + url.origin + '/' + name);
    if (req.method === 'POST') {
        req.json().then(data => sync_server.send(data));
        return new Response(null, { status: 204 });
    } else
        return new Response(sync_server.getReadableStream().pipeThrough(new TextEncoderStream()), {
            headers: { "Content-Type": "text/event-stream" }
        });
};
