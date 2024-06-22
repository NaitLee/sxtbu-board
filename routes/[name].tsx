import { Head } from "$fresh/runtime.ts";
import { BoardSyncServer, getSyncServer } from "../common/sync-server.ts";
import { Config, SESSION_NAME_LEN, randcode } from "../common/utils.tsx";
import { FreshContext } from "$fresh/server.ts";
import Board from "../islands/Board.tsx";

export const handler = (req: Request, ctx: FreshContext): Response | Promise<Response> => {
    const url = new URL(req.url);
    const name = url.pathname.slice(1);
    if ((name !== '' && name.length !== SESSION_NAME_LEN)
        || name.includes('/')
        || !name.split('').every(c => '0123456789'.includes(c))
    )
        return new Response(null, {
            status: 302,
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
            <title>{Config.brand_title || '乐思白板'}</title>
        </Head>
        <Board maximize={true} logo={Config.brand_logo[0] || "logo.svg"} css_path="/board.css" name={name} />
    </>;
}
