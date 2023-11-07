// deno-lint-ignore-file no-explicit-any
import { BoardMenuEvent, BoardState, UiState } from "../common/types.ts";
import BoardButton from "./BoardButton.tsx";
import MenuOptions from "./MenuOptions.tsx";
import { PEN_COLORS, PEN_WEIGHTS, THEMES } from "../common/utils.tsx";
import ColorPalette from "./ColorPalette.tsx";
import MenuOption from "./MenuOption.tsx";
import WeightPalette from "./WeightPalette.tsx";

interface BoardMenuProps {
    state: BoardState;
    uistate: UiState;
    dispatch: (key: object) => void;
    load_complete?: boolean;
}

export default function BoardMenu({ state, uistate, dispatch, load_complete }: BoardMenuProps) {
    type Curry<T> = (key: T, wrapper?: (value: string) => any) => (event: any) => void;
    type CurrySt = Curry<keyof BoardState>;
    type CurryUi = Curry<keyof UiState>;
    const set_state = (k: keyof BoardState, v: any) => {
        //@ts-ignore:
        state[k] = v;
        dispatch({ [k]: v });
    };
    const set_uistate = (k: keyof UiState, v: any) => {
        //@ts-ignore:
        uistate[k] = v;
        dispatch({ [k]: v });
    };
    const pass = (value: any) => value;
    const mkstcb: CurrySt = (key, wrapper = pass) =>
        (event: any) => set_state(key, wrapper(event.currentTarget.value));
    const mkuicb: CurryUi = (key, wrapper = pass) =>
        (event: any) => set_uistate(key, wrapper(event.currentTarget.value));
    const mkstcall: CurrySt = (key, wrapper = pass) =>
        (value: any) => set_state(key, wrapper(value));
    const mkuicall: CurryUi = (key, wrapper = pass) =>
        (value: any) => set_uistate(key, wrapper(value));
    const mkdpcb: Curry<string> = (key, wrapper = pass) =>
        (event: any) => dispatch({ [key]: wrapper(event.currentTarget.value) });
    const mkdpcall: Curry<string> = (key, wrapper = pass) =>
        (value: any) => dispatch({ [key]: wrapper(value) });
    return <>
        {load_complete ? <div class="board__options">
            <MenuOptions visible={uistate.options_on && uistate.options === 'pen'}>
                <MenuOption label="颜色">
                    <ColorPalette colors={PEN_COLORS} dispatch={mkstcall('color')} />
                </MenuOption>
                <MenuOption label="粗细">
                    <WeightPalette weights={PEN_WEIGHTS} dispatch={mkstcall('weight', parseFloat)} />
                </MenuOption>
                <MenuOption label="主题">
                    <ColorPalette colors={Object.keys(THEMES)} dispatch={mkuicall('theme')} />
                </MenuOption>
            </MenuOptions>
            <MenuOptions visible={uistate.options_on && uistate.options === 'erase'}>
                <BoardButton icon="trash-x" label="清除" onClick={mkdpcb('clear')} />
            </MenuOptions>
        </div> : void 0}
        <div class="board__menu">
            <div class="board__submenu">
                {uistate.fullscreen
                    ? <BoardButton icon="arrows-minimize" label="全屏" value="" onClick={mkuicb('fullscreen')} />
                    : <BoardButton icon="arrows-maximize" label="全屏" value="1" onClick={mkuicb('fullscreen')} />
                }
                <BoardButton icon="cloud-share" label="分享" onClick={mkdpcb('share')} />
                <BoardButton icon="location-share" label="加入" onClick={mkdpcb('join')} />
                <BoardButton icon="info-square-rounded" label="关于" onClick={mkdpcb('about')} />
            </div>
            <div class="board__submenu">
                <BoardButton icon="hand-move" label="移动" selected={state.mode === 'move'} value="move" onClick={mkdpcb('mode')} />
                <BoardButton icon="pencil" label="笔" selected={state.mode === 'pen'} value="pen" onClick={mkdpcb('mode')} />
                <BoardButton icon="eraser" label="擦除" selected={state.mode === 'erase'} value="erase" onClick={mkdpcb('mode')} />
                <BoardButton icon="arrow-back-up" label="撤销" onClick={mkdpcb('undo')} />
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
