
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
    page: number;
    eraser_size: number;
}

export interface UiState {
    options: BoardOptionsKey;
    options_on: boolean;
    share_on: boolean;
    join_on: boolean;
    about_on: boolean;
    fullscreen: boolean;
    theme: string;
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

export interface BoardMenuEvent {
    mode?: BoardMode;
    page?: number;
    new_page?: boolean;
    undo?: boolean;
    clear?: boolean;
    share?: boolean;
    join?: boolean;
    theme?: string;
    about?: boolean;
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
