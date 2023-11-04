import { useMemo } from "preact/hooks";
import { Stroke } from "../common/types.ts";

interface MemoPathProps {
    stroke: Stroke;
}

export default function MemoPath({ stroke }: MemoPathProps) {
    return useMemo(() => {
        const points = stroke.points;
        if (points.length === 0) return <path />;
        const a = points[0];
        let d = 'M ' + a.x + ',' + a.y;
        for (let i = 1; i < points.length; ++i) {
            const p = points[i];
            const q = points[i - 1];
            d += (p.x === 0 && p.y === 0 || q.x === 0 && q.y === 0 ? ' M ' : ' L ') + p.x + ',' + p.y;
        }
        return <path d={d} stroke={stroke.color} stroke-width={stroke.weight} />;
    }, [stroke.color, stroke.weight, stroke.points.length, stroke.points ]);
}
