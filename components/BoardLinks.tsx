import { useEffect, useState } from "preact/hooks";
import { Config, toggleClassName } from "../common/utils.tsx";
import BoardButton from "./BoardButton.tsx";
import Icon, { type IconKey } from "./Icon.tsx";

interface Link {
    icon: IconKey,
    url: string,
    label: string;
}

interface BoardLinksProps {
    links?: Link[];
    stroke_count?: number;
}

/*
const LINKS: Link[] = [
    // { icon: '', url: '', label: '' },
    { icon: 'search', url: 'https://www.baidu.com/', label: '百度搜索' },
    { icon: 'brand-wechat', url: 'https://filehelper.weixin.qq.com/', label: '微信文件传输' },
    { icon: 'cast', url: 'http://x.chaoxing.com/', label: '学习通投屏' },
    { icon: 'planet', url: 'https://i.chaoxing.com/', label: '学习通空间' },
];
*/

const LINKS: Link[] = [];
{
    let link_n = 1;
    while (true) {
        const thing = Config['link_' + link_n];
        if (!thing) break;
        LINKS.push({
            icon: thing[0] as IconKey,
            url: thing[1],
            label: thing[2] || thing[1],
        });
        link_n += 1;
    }
}

function BoardLink({ icon, url, label }: Link) {
    return <a class="board__link" href={url} target="_blank">
        <Icon name={icon} size={32} />
        <div class="board__link__label">{label}</div>
    </a>;
}

export default function BoardLinks({ links, stroke_count }: BoardLinksProps) {
    const [folded, set_folded] = useState(true);
    useEffect(() => set_folded(stroke_count != 0), [stroke_count]);
    return <div class={toggleClassName("board__links", { '--folded': folded })}>
        <BoardButton icon="affiliate" label="快捷链接" onClick={() => set_folded(false)} hidden={!folded} />
        <h2>常用链接</h2>
        {LINKS.concat(links || []).map(link => <BoardLink {...link} />)}
    </div>;
}
