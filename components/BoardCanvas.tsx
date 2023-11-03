import { BoardPage, Point } from "../common/types.ts";
import { strokeToPathD } from "../common/utils.tsx";

interface BoardCanvasProps {
    page: BoardPage;
    size: Point;
}

/** Render a BoardPage */
export default function BoardCanvas({ page, size }: BoardCanvasProps) {
    return <svg class="board__canvas" width={size.x || '100%'} height={size.y || '100%'}
        stroke-linecap="round" stroke-linejoin="round" fill="none"
    >
        <g style={`transform:translate(${page.offset.x}px,${page.offset.y}px)`}>
            {page.strokes.map(strokeToPathD)}
        </g>
    </svg>;
}
