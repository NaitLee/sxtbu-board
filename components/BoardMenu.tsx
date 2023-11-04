// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact/jsx-runtime";
import { BoardMenuEvent, BoardState } from "../common/types.ts";
import BoardButton from "./BoardButton.tsx";
import MenuOptions from "./MenuOptions.tsx";
import { PEN_COLORS, PEN_WEIGHTS, toggleClassName } from "../common/utils.tsx";
import ColorPalette from "./ColorPalette.tsx";
import MenuOption from "./MenuOption.tsx";
import WeightPalette from "./WeightPalette.tsx";

interface BoardMenuProps {
    state: BoardState;
    dispatch: (state: BoardMenuEvent) => void;
}

export default function BoardMenu({ state, dispatch }: BoardMenuProps) {
    const mkevcb = (key: keyof BoardMenuEvent, wrapper: (value: string) => any = (value) => value) =>
        (event: any) =>
            dispatch({ [key]: wrapper(event.currentTarget.value) });
    const mkcall = (key: keyof BoardMenuEvent, wrapper: (value: string) => any = (value) => value) =>
        (value: any) =>
            dispatch({ [key]: wrapper(value) });
    return <>
        <div class="board__options">
            <MenuOptions visible={state.options_on && state.options === 'pen'}>
                <MenuOption label="颜色">
                    <ColorPalette colors={PEN_COLORS} dispatch={mkcall('color')} />
                </MenuOption>
                <MenuOption label="粗细">
                    <WeightPalette weights={PEN_WEIGHTS} dispatch={mkcall('weight', parseFloat)} />
                </MenuOption>
            </MenuOptions>
        </div>
        <div class="board__menu">
            <div class="board__submenu">
                {state.fullscreen
                    ? <BoardButton icon="arrows-minimize" label="全屏" value="" onClick={mkevcb('fullscreen')} />
                    : <BoardButton icon="arrows-maximize" label="全屏" value="1" onClick={mkevcb('fullscreen')} />
                }
                <BoardButton icon="cloud-share" label="分享" onClick={mkevcb('share')} />
                {/* <BoardButton icon="location-share" label="加入" onClick={mkevcb('join')} /> */}
                <BoardButton icon="trash-x" label="清除" onClick={mkevcb('clear')} />
            </div>
            <div class="board__submenu">
                <BoardButton icon="hand-move" label="移动" selected={state.mode === 'move'} value="move" onClick={mkevcb('mode')} />
                <BoardButton icon="pencil" label="笔" selected={state.mode === 'pen'} value="pen" onClick={mkevcb('mode')} />
                <BoardButton icon="eraser" label="擦除" selected={state.mode === 'erase'} value="erase" onClick={mkevcb('mode')} />
                <BoardButton icon="arrow-back-up" label="撤销" onClick={mkevcb('undo')} />
                {/* <BoardButton icon="adjustments-horizontal" label="工具" value="tools" onClick={mkdispatch('options')} /> */}
            </div>
            <div class="board__submenu">
                <BoardButton icon="arrow-left" label="上一页" onClick={() => dispatch({ page: state.page - 1 })} />
                <button class="board__menu-button board__menu-page-count">{state.page + 1}</button>
                <BoardButton icon="arrow-right" label="下一页" onClick={() => dispatch({ page: state.page + 1 })} />
                <BoardButton icon="plus" label="添加" onClick={() => dispatch({ page: state.page + 1, new_page: true })} />
            </div>
        </div>
    </>;
}
