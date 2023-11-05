import { toggleClassName } from "../common/utils.tsx";
import { useState } from "preact/hooks";

interface BoardJoinProps {
    visible?: boolean;
    hide: () => void;
}

export default function BoardJoin({ visible, hide }: BoardJoinProps) {
    const [name, set_name] = useState('');
    return <div class={toggleClassName("board__join", { '--visible': visible })}>
        <h2>请输入房间号</h2>
        <div><input class="board__join-input" type="number" value={name} onChange={event => set_name(event.currentTarget.value)} /></div>
        <div><button class="board__join-button" onClick={() => {
            if (name) 
                location.assign('/' + name);
            else
                hide();
        }}>加入</button></div>
    </div>;
}
