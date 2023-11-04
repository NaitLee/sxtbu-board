import { qrcode } from "qrcode";
import { BLANK_IMG_URL, toggleClassName } from "../common/utils.tsx";
import { useMemo } from "preact/hooks";

interface BoardShareProps {
    name: string;
    visible?: boolean;
    link?: string;
}

export default function BoardShare({ name, link, visible }: BoardShareProps) {
    const qrstr = link || (self.location ? location.href : '');
    const qrdata = useMemo(() => {
        if (!self.location) return BLANK_IMG_URL;
        const code = qrcode(4, 'L');
        code.addData(qrstr);
        code.make();
        return code.createDataURL(24, 48);
    }, [qrstr]);
    return <div class={toggleClassName("board__share", { '--visible': visible })}>
        <h1>扫码同步显示板书</h1>
        <div class="board__qr" style={'background-image: url(\'' + qrdata + '\')'}></div>
        {/* <div class="board__name">
            {name.split('').map(c => <span>{c}</span>)}
        </div> */}
        <p class="board__p">轻触回到白板</p>
    </div>;
}
