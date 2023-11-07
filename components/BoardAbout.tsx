import { toggleClassName } from "../common/utils.tsx";

interface BoardAboutProps {
    visible?: boolean;
    hide: () => void;
}

export default function BoardAbout({ visible, hide }: BoardAboutProps) {
    return <div class={toggleClassName("board__about", { '--visible': visible })}>
        <h2>关于</h2>
        <p>工商白板</p>
        <p>版权所有 © 山西工商学院，保留所有权利。</p>
        <p>以 <a href="https://www.gnu.org/licenses/agpl-3.0.html">GNU Affero 通用公共许可证第 3 版</a>授权。<br />您也可以使用更新的版本。</p>
        <p>
            <a href="https://github.com/NaitLee/sxtbu-board" target="_blank">查验源代码</a>
        </p>
        <p>
            <a href="https://fresh.deno.dev">
                <img class="board__fresh-logo" width="197" height="37"
                    src="https://fresh.deno.dev/fresh-badge.svg"
                    alt="Made with Fresh"
                />
            </a>
        </p>
        <p><button class="board__big-button" onClick={hide}>确定</button></p>
    </div>;
}
