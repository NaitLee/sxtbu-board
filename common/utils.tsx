import { BoardPage, Point, Stroke } from "./types.ts";

export const DEF_STROKE_COLOR = 'var(--board-stroke)';
export const DEF_STROKE_WEIGHT = 4;
export const BLANK_IMG_URL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
export const MIN_ERASER_SIZE = 120;
export const THR_TOGGLE_ERASER = 2;
export const PEN_COLORS = [
    DEF_STROKE_COLOR, 'red', 'blue', 'green'
];
export const PEN_WEIGHTS = [
    2, 4, 6, 8, 10, 12, 14, 16
];

export function updateObject<T, K>(a: T, b: K): T & K {
    return Object.assign({}, a, b);
}

export function point(x: number, y: number): Point {
    return { x: x, y: y };
}

export function offsetPoints(points: Point[], offset: Point) {
    return points.map(p => (p.x === 0 && p.y === 0 ? p : { x: p.x + offset.x, y: p.y + offset.y }));
}

export function filterPoints(points: Point[], c: Point, r: number) {
    return cleanPoints(points.map(p => Math.hypot(c.x - p.x, c.y - p.y) > r ? p : point(0, 0)));
}

export function cleanPoints(points: Point[]) {
    if (points.length === 0) return [];
    const result: Point[] = [];
    const p = points[0];
    if (p.x !== 0 && p.y !== 0)
        result.push(p);
    if (points.length <= 1) return result;
    for (let i = 0; i < points.length - 1; ++i) {
        const p = points[i];
        const q = points[i + 1];
        if (p.x === 0 && p.y === 0 && q.x === 0 && q.y === 0)
            continue;
        else
            result.push(p);
    }
    const q = points[points.length - 1];
    if (q.x !== 0 && q.y !== 0)
        result.push(q);
    return result;
}

export function estimateEraserThreshold(points: Point[], current: Point) {
    for (const p of points)
        if (p.x > current.x && p.y > current.y)
            current = ({ x: p.x, y: p.y });
    return current;
}

export function new_stroke(): Stroke {
    return { points: [], color: DEF_STROKE_COLOR, weight: DEF_STROKE_WEIGHT };
}

export function new_page(): BoardPage {
    return { strokes: [], offset: { x: 0, y: 0 } };
}

// deno-lint-ignore no-explicit-any
export function toggleClassName(name: string, toggles: { [suffix: string]: any }) {
    for (const suffix in toggles)
        if (toggles[suffix])
            name += ' ' + name + suffix;
    return name;
}
