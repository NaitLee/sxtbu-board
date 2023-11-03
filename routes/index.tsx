import Board from "../islands/Board.tsx";

export default function Home() {
    return <>
        <Board maximize={true} logo="/watermark.svg" css_path="/board.css" />
        {/* <Board maximize={false} width={640} height={480} /> */}
    </>;
}
