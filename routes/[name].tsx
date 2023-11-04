import { Head } from "$fresh/runtime.ts";
import { BoardSyncServer, getSyncServer } from "../common/sync-server.ts";
import { randcode } from "../common/utils.tsx";
import Board from "../islands/Board.tsx";

export default function Home({ url }: { url: URL }) {
    const name = url.pathname.slice(1) || randcode(6);
    if (!getSyncServer(name)) new BoardSyncServer(name);
    return <>
        <Head>
            <title>工商白板</title>
        </Head>
        <Board maximize={true} logo="/watermark.svg" css_path="/board.css" name={name} />
    </>;
}
