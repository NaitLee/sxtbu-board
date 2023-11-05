import { Head } from "$fresh/runtime.ts";
import { BoardSyncServer, getSyncServer } from "../common/sync-server.ts";
import { SESSION_NAME_LEN, randcode } from "../common/utils.tsx";
import { HandlerContext, Status } from "$fresh/server.ts";
import Board from "../islands/Board.tsx";

export const handler = (req: Request, ctx: HandlerContext): Response | Promise<Response> => {
    const url = new URL(req.url);
    const name = url.pathname.slice(1);
    if ((name !== '' && name.length !== SESSION_NAME_LEN)
        || name.includes('/')
        || !name.split('').every(c => '0123456789'.includes(c))
    )
        return new Response(null, {
            status: Status.Found,
            headers: { 'Location': '/' }
        });
    else
        return ctx.render();
}

export default function Home({ url }: { url: URL }) {
    const name = url.pathname.slice(1) || randcode(SESSION_NAME_LEN);
    if (!getSyncServer(name))
        new BoardSyncServer(name);
    return <>
        <Head>
            <title>工商白板</title>
        </Head>
        <Board maximize={true} logo="/watermark.svg" css_path="/board.css" name={name} />
    </>;
}
