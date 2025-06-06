import { useRef, useState } from "preact/hooks";
import { BoardMode, BoardPadEvent, BoardState, Point } from "../common/types.ts";
import { MIN_ERASER_SIZE, THR_TOGGLE_ERASER, point } from "../common/utils.tsx";
import MemoPath from "./MemoPath.tsx";

interface BoardPadProps {
    dispatch: (event: BoardPadEvent) => void;
    size: Point;
    state: BoardState;
}

interface InputCallbackSet {
    down(args: InputCallbackArgs[]): void;
    move(args: InputCallbackArgs[]): void;
    up(args: InputCallbackArgs[]): void;
}

interface InputCallbackArgs {
    x: number;
    y: number;
    ex: number;
    ey: number;
    id: number;
    force: number;
    angle: number;
    is_touch: boolean;
}

function callbackArgsFromTouches(touches: TouchList): InputCallbackArgs[] {
    return Array.from(touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        ex: touch.radiusX || 1,
        ey: touch.radiusY || 1,
        id: touch.identifier,
        force: touch.force || 1,
        angle: touch.rotationAngle,
        is_touch: true
    }));
}
function callbackArgsFromPointer(pointer: PointerEvent): InputCallbackArgs[] {
    return [{
        x: pointer.clientX,
        y: pointer.clientY,
        ex: pointer.width || 1,
        ey: pointer.height || 1,
        id: pointer.pointerId,
        force: pointer.pressure || 1,
        angle: pointer.twist || 0,
        is_touch: pointer.pointerType === 'touch'
    }];
}

export default function BoardPad({ dispatch, size, state }: BoardPadProps) {
    const [points, set_points] = useState<Point[][]>([]);
    const ref_touchcount = useRef(0);
    const ref_touchmap = useRef<Record<number, number>>({});
    const [last_point, set_last_point] = useState<Point>(point(0, 0));
    const [pen_down, set_pen_down] = useState(false);
    const update_points = (id: number, new_point: Point) => {
        if (!points[id]) points[id] = [point(0, 0)];
        points[id].push(new_point);
        set_points(points.concat());
    };
    const commit_points = () => {
        dispatch({ points: points });
        set_points([]);
    }
    const callbacks: Record<BoardMode, InputCallbackSet> = {
        'pointer': {
            down(args) {},
            move(args) {},
            up(args) {}
        },
        'pen': {
            down(args) {
                dispatch({ start: true });
                if (args.length === 1 && args[0].is_touch === false) {
                    // mouse
                    const { x, y } = args[0];
                    update_points(0, point(x, y));
                    set_last_point(point(x, y));
                    set_pen_down(true);
                    return;
                }
                for (const arg of args) {
                    const { x, y, id, ex, ey } = arg;
                    // ex and ey are heavily device dependent
                    /*
                    if (Math.max(ex, ey) > THR_TOGGLE_ERASER && !(ex === 50 && ey === 50)) {
                        dispatch({
                            toggle_erase: true,
                            eraser_size: MIN_ERASER_SIZE // Math.max(ex, ey, MIN_ERASER_SIZE)
                        });
                    }
                    */
                    const index = ref_touchcount.current++;
                    update_points(index, point(x, y));
                    ref_touchmap.current[id] = index;
                }
                const p = args[0];
                set_last_point(point(p.x, p.y));
                set_pen_down(true);
            },
            move(args) {
                if (!pen_down) return;
                if (args.length === 1 && args[0].is_touch === false) {
                    // mouse
                    const { x, y } = args[0];
                    update_points(0, point(x, y));
                    return;
                }
                for (const arg of args) {
                    const { x, y, id } = arg;
                    const index = ref_touchmap.current[id];
                    update_points(index, point(x, y));
                }
            },
            up(args) {
                if (args.length === 1 && args[0].is_touch === false) {
                    // mouse
                    const { x, y } = args[0];
                    update_points(0, point(x, y));
                    set_pen_down(false);
                    commit_points();
                    return;
                }
                for (const arg of args) {
                    const { x, y, id } = arg;
                    const index = ref_touchmap.current[id];
                    update_points(index, point(x, y));
                }
                if (args.length === 0) {
                    ref_touchcount.current = 0;
                    ref_touchmap.current = {};
                    set_pen_down(false);
                    commit_points();
                }
            }
        },
        'move': {
            down(args) {
                const p = args[0];
                set_pen_down(true);
                set_last_point(point(p.x, p.y));
            },
            move(args) {
                if (!pen_down) return;
                const p = args[0];
                dispatch({ move: point(p.x - last_point.x, p.y - last_point.y) });
                set_last_point(point(p.x, p.y));
            },
            up(args) {
                set_last_point(point(0, 0));
                set_pen_down(false);
            }
        },
        'erase': {
            down(args) {
                const p = args[0];
                dispatch({ erase: point(p.x, p.y) });
                set_pen_down(true);
            },
            move(args) {
                if (!pen_down) return;
                const { x, y } = args[0];
                dispatch({
                    erase: point(x, y),
                    eraser_size: MIN_ERASER_SIZE // Math.max(ex, ey, MIN_ERASER_SIZE)
                });},
            up(args) {
                dispatch({ erase_done: true });
                set_pen_down(false);
            }
        }
    };
    const callback = callbacks[state.mode];
    const ontouchstart = (event: TouchEvent) => {
        if (event.touches.length !== 0)
            callback.down(callbackArgsFromTouches(event.touches));
    };
    const ontouchmove = (event: TouchEvent) => {
        event.preventDefault();
        if (event.touches.length !== 0)
            callback.move(callbackArgsFromTouches(event.touches));
    };
    const ontouchend = (event: TouchEvent) => {
        callback.up(callbackArgsFromTouches(event.touches));
    };
    const ondown = (event: PointerEvent) => {
        callback.down(callbackArgsFromPointer(event));
    };
    const onmove = (event: PointerEvent) => {
        callback.move(callbackArgsFromPointer(event));
    };
    const onup = (event: PointerEvent) => {
        callback.move(callbackArgsFromPointer(event));
        callback.up([]);
    };
    const prevent = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return <svg class="board__pad" stroke-linecap="round" stroke-linejoin="round" fill="none"
        width={size.x || '100%'} height={size.y || '100%'} onContextMenu={prevent} onResize={prevent} onScroll={prevent}
        onTouchStart={ontouchstart} //onTouchMove={ontouchmove} onTouchEnd={ontouchend} onTouchCancel={ontouchend}
        onPointerDown={ondown} onPointerMove={onmove} onPointerUp={onup} onPointerCancel={onup}
    >
        {points.map(points => <MemoPath stroke={{ points: points, color: state.color, weight: state.weight }} />)}
    </svg>;
}
