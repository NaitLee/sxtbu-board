import { Point } from "../common/types.ts";
import { toggleClassName } from "../common/utils.tsx";

interface EraserSpriteProps {
    show?: boolean;
    size: number;
    offset: Point;
}

export default function EraserSprite({ show, size, offset }: EraserSpriteProps) {
    const metrics = (offset.x - size / 2) + 'px,' + (offset.y - size / 2) + 'px';
    return <div class={toggleClassName("board__eraser-sprite", { '--hidden': !show })}
        style={`width:${size}px;height:${size}px;border-radius:${size / 2}px;transform:translate(${metrics})`}></div>;
}
