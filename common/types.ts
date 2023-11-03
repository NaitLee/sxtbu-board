
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
    points?: Point[][];
    move?: Point;
    move_done?: boolean;
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
}
