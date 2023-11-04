import { Head } from "$fresh/runtime.ts";
import Board from "../islands/Board.tsx";

export default function Home() {
    return <>
        <Head>
            <title>工商白板</title>
        </Head>
        <Board maximize={true} logo="/watermark.svg" css_path="/board.css" />
    </>;
}
