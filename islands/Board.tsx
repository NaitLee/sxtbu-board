import { useEffect, useRef, useState } from "preact/hooks";
import BoardCanvas from "../components/BoardCanvas.tsx";
import BoardMenu from "../components/BoardMenu.tsx";
import BoardPad from "../components/BoardPad.tsx";
import { BoardMenuEvent, BoardPadEvent, BoardState, Point } from "../common/types.ts";
import { BoardData } from "../common/types.ts";
import { BLANK_IMG_URL, DEF_STROKE_COLOR, DEF_STROKE_WEIGHT, MIN_ERASER_SIZE, filterPoints, new_page, offsetPoints, point, toggleClassName, updateObject } from "../common/utils.tsx";
import BoardLinks from "../components/BoardLinks.tsx";
import EraserSprite from "../components/EraserSprite.tsx";

interface BoardProps {
    maximize?: boolean;
    css_path?: string;
    width?: number;
    height?: number;
    logo?: string;
}

export default function Board({ maximize, css_path, width, height, logo }: BoardProps) {
    const [state, set_state] = useState<BoardState>({
        color: DEF_STROKE_COLOR,
        weight: DEF_STROKE_WEIGHT,
        mode: 'pen',
        options: '',
        options_on: false,
        page: 0,
        fullscreen: false,
        eraser_size: MIN_ERASER_SIZE
    });
    const [data, set_data] = useState<BoardData>({
        pages: [updateObject({}, new_page())],
        state: state
    });
    const [page, set_page] = useState(data.pages[state.page]);
    const [size, set_size] = useState<Point>({
        x: width || self.innerWidth || 0,
        y: height || self.innerHeight || 0
    });
    const [eraser_p, set_eraser_p] = useState<Point>({
        x: size.x / 2,
        y: size.y / 2
    });
    const ref_board = useRef<HTMLDivElement | null>(null);
    if (maximize)
        useEffect(() => self.addEventListener('resize', () => set_size({
            x: self.innerWidth,
            y: self.innerHeight
        })), []);
    useEffect(() => {
        if (!ref_board.current) return;
        if (state.fullscreen && !document.fullscreenElement)
            ref_board.current.requestFullscreen();
        else if (document.fullscreenElement)
            document.exitFullscreen();
    }, [state.fullscreen]);
    const board_pad_dispatch = (event: BoardPadEvent) => {
        for (const key in event) {
            switch (key) {
                case 'start':
                    state.options_on = false;
                    break;
                case 'points':
                    for (const points of event.points!) {
                        page.strokes.push({
                            points: offsetPoints(points, page.offset),
                            color: state.color,
                            weight: state.weight
                        });
                    }
                    break;
                case 'move':
                    page.offset = event.move!;
                    break;
                case 'move_done':
                    for (const stroke of page.strokes)
                        stroke.points = offsetPoints(stroke.points, page.offset);
                    page.offset = point(0, 0);
                    break;
                case 'toggle_erase':
                    state.mode = 'erase';
                    break;
                case 'erase':
                    set_eraser_p(event.erase!);
                    for (let i = 0; i < page.strokes.length; ++i) {
                        const stroke = page.strokes[i];
                        stroke.points = filterPoints(stroke.points, event.erase!, state.eraser_size / 2);
                        if (stroke.points.length === 0)
                            page.strokes.splice(i, 1);
                    }
                    break;
                case 'eraser_size':
                    state.eraser_size = event.eraser_size!;
                    break;
                case 'erase_done':
                    state.mode = 'pen';
                    break;
            }
            set_page(updateObject({}, page));
        }
    };
    const board_menu_dispatch = (event: BoardMenuEvent) => {
        const new_state = updateObject(state, event);
        for (const key in event) {
            switch (key) {
                case 'mode':
                    if (state.mode === new_state.mode) {
                        new_state.options = new_state.mode;
                        new_state.options_on = !state.options_on;
                    } else
                        new_state.options_on = false;
                    break;
                case 'page':
                    data.pages[event.page!] = data.pages[event.page!] || updateObject({}, new_page());
                    set_page(data.pages[new_state.page]);
                    break;
                case 'new_page':
                    data.pages.splice(event.page!, 0, updateObject({}, new_page()));
                    set_page(data.pages[new_state.page]);
                    break;
                case 'undo':
                    page.strokes.pop();
                    set_page(updateObject({}, page));
                    break;
                case 'clear':
                    page.strokes = [];
                    set_page(updateObject({}, page));
                    break;
            }
        }
        set_state(new_state);
    };
    return <div ref={ref_board} class={toggleClassName('board', { '--maximized': maximize })}
        style={size.x && size.y ? `width:${size.x}px;height:${size.y}px` : 'width:100%;height:100%;'}
    >
        <link rel="stylesheet" href={css_path || '/board.css'} />
        <BoardCanvas page={page} size={size} />
        <BoardPad dispatch={board_pad_dispatch} size={size} state={state} />
        <EraserSprite show={state.mode === 'erase'} size={state.eraser_size} offset={eraser_p} />
        <img class="board__logo" src={logo || BLANK_IMG_URL} />
        <BoardLinks stroke_count={page.strokes.length} />
        <BoardMenu state={state} dispatch={board_menu_dispatch} />
    </div>;
}
