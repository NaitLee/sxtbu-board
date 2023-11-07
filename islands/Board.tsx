import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import BoardCanvas from "../components/BoardCanvas.tsx";
import BoardMenu from "../components/BoardMenu.tsx";
import BoardPad from "../components/BoardPad.tsx";
import { BoardMenuEvent, BoardPadEvent, BoardState, BoardSyncData, Point, Stroke, UiState } from "../common/types.ts";
import { BoardData } from "../common/types.ts";
import { BLANK_IMG_URL, DEF_STROKE_COLOR, DEF_STROKE_WEIGHT, MIN_ERASER_SIZE, filterPoints, new_page, offset, offsetPoints, point, toggleClassName, updateObject } from "../common/utils.tsx";
import BoardLinks from "../components/BoardLinks.tsx";
import EraserSprite from "../components/EraserSprite.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { BoardSyncClient } from "../common/sync-client.ts";
import BoardShare from "../components/BoardShare.tsx";
import BoardJoin from "../components/BoardJoin.tsx";
import BoardTheme from "../components/BoardTheme.tsx";
import BoardAbout from "../components/BoardAbout.tsx";

interface BoardProps {
    name: string;
    maximize?: boolean;
    css_path?: string;
    width?: number;
    height?: number;
    logo?: string;
    api?: string;
}

export default function Board({ maximize, css_path, width, height, logo, name, api }: BoardProps) {
    const [state, set_state] = useState<BoardState>({
        color: DEF_STROKE_COLOR,
        weight: DEF_STROKE_WEIGHT,
        mode: 'pen',
        page: 0,
        eraser_size: MIN_ERASER_SIZE,
    });
    const [uistate, set_uistate] = useState<UiState>({
        fullscreen: false,
        options: '',
        options_on: false,
        share_on: false,
        join_on: false,
        theme: '',
        about_on: false,
    });
    const [data, set_data] = useState<BoardData>({
        pages: [updateObject({}, new_page())],
        state: state
    });
    const [page, set_page] = useState(data.pages[state.page]);
    set_page(data.pages[state.page]);
    const goto_page = (n: number) => {
        state.page = n;
        data.pages[n] = data.pages[n] || new_page();
        // set_page(data.pages[n]);
    }
    const insert_page = (n: number) => {
        state.page = n;
        data.pages.splice(n, 0, new_page());
        // set_page(data.pages[n]);
    }
    const [size, set_size] = useState<Point>({
        x: width || self.innerWidth || 0,
        y: height || self.innerHeight || 0
    });
    const [eraser_p, set_eraser_p] = useState<Point>({
        x: size.x / 2,
        y: size.y / 2
    });
    // just for syncing
    const [erase_points, set_erase_points] = useState<Point[]>([]);
    const ref_sync_client = useRef<BoardSyncClient>();
    const [load_complete, set_load_complete] = useState(false);
    useEffect(() => {
        requestAnimationFrame(() => set_load_complete(true));
    }, []);
    const update_state = () => {
        set_state(Object.assign({}, state));
        set_uistate(Object.assign({}, uistate));
    };
    const sync = (data: BoardSyncData) => {
        const send = (data: BoardSyncData) => ref_sync_client.current!.send(Object.assign(data, { page: state.page }));
        if (!ref_sync_client.current) return;
        send(data);
    };
    useEffect(() => {
        if (!name || !IS_BROWSER) return;
        ref_sync_client.current = new BoardSyncClient(name, api || '/api/sync?name=', (sdata) => {
            const n = sdata.page!;
            let page = data.pages[n] || new_page();
            for (const key in sdata) {
                switch (key) {
                    /*
                    case 'resync_request':
                        sync({ resync_response: true, data: data });
                        break;
                    */
                    case 'data':
                        set_data(updateObject(sdata, sdata.data!));
                        // set_state(sdata.data!.state);
                        break;
                    case 'stroke':
                        page.strokes.push(sdata.stroke!);
                        break;
                    case 'page':
                        // free to view any page
                        data.pages[n] = page;
                        break;
                    case 'new_page':
                        // always new
                        page = new_page();
                        data.pages.splice(n, 0, page);
                        break;
                    case 'undo':
                        page.strokes.pop();
                        break;
                    case 'clear':
                        page.strokes = [];
                        break;
                    case 'erase':
                        for (const point of sdata.erase!)
                            for (const stroke of page.strokes)
                                stroke.points = filterPoints(stroke.points, offset(point, page.offset), state.eraser_size / 2);
                        break;
                }
            }
            set_page(updateObject({}, page));
            update_state();
        });
    }, []);
    const ref_board = useRef<HTMLDivElement | null>(null);
    if (maximize)
        useEffect(() => self.addEventListener('resize', () => set_size({
            x: self.innerWidth,
            y: self.innerHeight
        })), []);
    useEffect(() => {
        if (!ref_board.current) return;
        if (uistate.fullscreen && !document.fullscreenElement)
            ref_board.current.requestFullscreen();
        else if (document.fullscreenElement)
            document.exitFullscreen();
        update_state();
    }, [uistate.fullscreen]);
    const board_pad_dispatch = (event: BoardPadEvent) => {
        for (const key in event) {
            switch (key) {
                case 'start':
                    uistate.options_on = uistate.share_on = false;
                    break;
                case 'points':
                    for (const points of event.points!) {
                        const stroke: Stroke = {
                            points: offsetPoints(points, page.offset),
                            color: state.color,
                            weight: state.weight
                        };
                        page.strokes.push(stroke);
                        sync({ stroke: stroke });
                    }
                    break;
                case 'move':
                    page.offset.x += event.move!.x;
                    page.offset.y += event.move!.y;
                    break;
                case 'toggle_erase':
                    state.mode = 'erase';
                    break;
                case 'erase':
                    set_eraser_p(updateObject({}, event.erase!)); // don't offset sprite
                    offset(event.erase!, page.offset);
                    for (let i = 0; i < page.strokes.length; ++i) {
                        const stroke = page.strokes[i];
                        stroke.points = filterPoints(stroke.points, event.erase!, state.eraser_size / 2);
                        set_erase_points(erase_points.concat(event.erase!));
                        if (stroke.points.length === 0)
                            page.strokes.splice(i, 1);
                    }
                    break;
                case 'eraser_size':
                    state.eraser_size = event.eraser_size!;
                    break;
                case 'erase_done':
                    state.mode = 'pen';
                    sync({ erase: erase_points });
                    set_erase_points([]);
                    break;
            }
            set_page(updateObject({}, page));
        }
        update_state();
    };
    const board_menu_dispatch = (event: BoardMenuEvent) => {
        for (const key in event) {
            switch (key) {
                case 'mode':
                    uistate.options = event.mode!;
                    if (state.mode === event.mode!) {
                        uistate.options_on = !uistate.options_on;
                    } else uistate.options_on = false;
                    break;
                case 'page':
                    goto_page(event.page!);
                    sync({ page: event.page! });
                    break;
                case 'new_page':
                    insert_page(event.page!)
                    sync({ page: event.page!, new_page: true });
                    break;
                case 'undo':
                    page.strokes.pop();
                    set_page(updateObject({}, page));
                    sync({ undo: true });
                    break;
                case 'clear':
                    page.strokes = [];
                    set_page(updateObject({}, page));
                    sync({ clear: true });
                    break;
                case 'share':
                    uistate.share_on = !uistate.share_on;
                    uistate.join_on = false;
                    uistate.about_on = false;
                    break;
                case 'join':
                    uistate.join_on = !uistate.join_on;
                    uistate.share_on = false;
                    uistate.about_on = false;
                    break;
                case 'about':
                    uistate.about_on = !uistate.about_on;
                    uistate.share_on = false;
                    uistate.join_on = false;
                    break;
                case 'theme':
                    uistate.theme = event.theme!;
                    break;
            }
        }
        update_state();
    };
    return <div ref={ref_board} class={toggleClassName('board', { '--maximized': maximize })}
        style={size.x && size.y ? `width:${size.x}px;height:${size.y}px` : 'width:100%;height:100%;'}
    >
        <link rel="stylesheet" href={css_path || '/board.css'} />
        <BoardTheme name={uistate.theme} />
        <BoardCanvas page={page} size={size} />
        <BoardPad dispatch={board_pad_dispatch} size={size} state={state} />
        <div class="board__logo" style={'background-image:url(\'' + (logo || BLANK_IMG_URL) + '\')'}></div>
        <EraserSprite show={state.mode === 'erase'} size={state.eraser_size} offset={eraser_p} />
        <BoardLinks stroke_count={page.strokes.length} />
        {load_complete ? <>
            <BoardShare name={name} visible={uistate.share_on} hide={() => set_uistate(updateObject(uistate, { share_on: false }))} />
            <BoardJoin visible={uistate.join_on} hide={() => set_uistate(updateObject(uistate, { join_on: false }))} />
            <BoardAbout visible={uistate.about_on} hide={() => set_uistate(updateObject(uistate, { about_on: false }))} />
        </> : void 0}
        <BoardMenu state={state} uistate={uistate} dispatch={board_menu_dispatch}
            load_complete={load_complete} />
    </div>;
}
