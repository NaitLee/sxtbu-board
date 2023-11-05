
export interface BoardData {
    pages: BoardPage[];
    state: BoardState;
}

export interface BoardPage {
    strokes: Stroke[];
    // stuffs: Stuff[];
    offset: Point;
}

export interface BoardState {
    color: string;
    weight: number;
    mode: BoardMode;
    options: BoardOptionsKey;
    options_on: boolean;
    page: number;
    fullscreen: boolean;
    eraser_size: number;
    share_on: boolean;
    join_on: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface Stuff {
    offset: Point;
    size: Point;
    type: StuffType;
    url: string;
}

export interface Stroke {
    points: Point[];
    color: string;
    weight: number;
}

export type BoardMode = 'pointer' | 'pen' | 'move' | 'erase';
export type BoardOptionsKey = '' | BoardMode | 'tools';
export type StuffType = 'img';

export interface BoardPadEvent {
    start?: boolean;
    points?: Point[][];
    move?: Point;
    toggle_erase?: boolean;
    eraser_size?: number;
    erase?: Point;
    erase_done?: boolean;
}

export interface BoardMenuEvent extends Partial<BoardState> {
    new_page?: boolean;
    undo?: boolean;
    clear?: boolean;
    share?: boolean;
    join?: boolean;
}

export interface BoardSyncData {
    queue?: number;
    identifier?: string;
    data?: BoardData;
    stroke?: Stroke;
    erase?: Point[];
    clear?: boolean;
    undo?: boolean;
    // move?: Point;
    page?: number;
    new_page?: boolean;
    resync_request?: boolean;
    resync_response?: boolean;
}
