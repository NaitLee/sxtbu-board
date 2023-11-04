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
    // force: number;
    // angle: number;
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
function callbackArgsFromMouse(mouse: MouseEvent): InputCallbackArgs[] {
    return [{
        x: mouse.clientX,
        y: mouse.clientY,
        ex: 1,
        ey: 1,
        id: 0,
        // force: 1,
        // angle: 0,
        is_touch: false
    }];
}

export default function BoardPad({ dispatch, size, state }: BoardPadProps) {
    const [points, set_points] = useState<Point[][]>([]);
    const ref_touchcount = useRef(0);
    const ref_touchmap = useRef<Record<number, number>>({});
    const [first_point, set_first_point] = useState<Point>(point(0, 0));
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
                if (args.length === 1 && args[0].is_touch === false) {
                    // mouse
                    const { x, y } = args[0];
                    update_points(0, point(x, y));
                    set_first_point(point(x, y));
                    set_pen_down(true);
                    return;
                }
                for (const arg of args) {
                    const { x, y, id, ex, ey } = arg;
                    if (Math.max(ex, ey) > THR_TOGGLE_ERASER) {
                        dispatch({
                            toggle_erase: true,
                            eraser_size: MIN_ERASER_SIZE // Math.max(ex, ey, MIN_ERASER_SIZE)
                        });
                    }
                    const index = ref_touchcount.current++;
                    update_points(index, point(x, y));
                    ref_touchmap.current[id] = index;
                }
                const p = args[0];
                set_first_point(point(p.x, p.y));
                set_pen_down(true);
                dispatch({ start: true });
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
                set_first_point(point(p.x, p.y));
            },
            move(args) {
                if (!pen_down) return;
                const p = args[0];
                dispatch({ move: point(p.x - first_point.x, p.y - first_point.y) });
            },
            up(args) {
                dispatch({ move_done: true });
                set_first_point(point(0, 0));
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
                const { x, y, ex, ey } = args[0];
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
    const onmousedown = (event: MouseEvent) => {
        callback.down(callbackArgsFromMouse(event));
    };
    const onmousemove = (event: MouseEvent) => {
        callback.move(callbackArgsFromMouse(event));
    };
    const onmouseup = (event: MouseEvent) => {
        callback.up(callbackArgsFromMouse(event));
    };
    const oncontextmenu = (event: MouseEvent) => {
        event.preventDefault();
    };
    return <svg class="board__pad" stroke-linecap="round" stroke-linejoin="round" fill="none"
        width={size.x || '100%'} height={size.y || '100%'} onContextMenu={oncontextmenu}
        onTouchStart={ontouchstart} onTouchMove={ontouchmove} onTouchEnd={ontouchend} onTouchCancel={ontouchend}
        onMouseDown={onmousedown} onMouseMove={onmousemove} onMouseUp={onmouseup}
    >
        {points.map(points => <MemoPath stroke={{ points: points, color: state.color, weight: state.weight }} />)}
    </svg>;
}
