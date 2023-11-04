import { useState } from "preact/hooks";
import { DEF_STROKE_WEIGHT, toggleClassName } from "../common/utils.tsx";

interface WeightPaletteProps {
    weights: number[];
    dispatch: (weight: number) => void;
}

export default function WeightPalette({ weights, dispatch }: WeightPaletteProps) {
    const [selected, set_selected] = useState<number>(DEF_STROKE_WEIGHT);
    const onclick = (event: Event) => {
        //@ts-ignore:
        const value = parseFloat(event.currentTarget.value);
        dispatch(value);
        set_selected(value);
    }
    return <div class="board__weight-palette">
        {weights.map(weight => <button
            class={toggleClassName("board__weight-palette__palette", { '--selected': weight === selected })}
            value={weight} onClick={onclick}
        >
            <div style={`border-top:${weight}px solid var(--board-menu-fore)`}></div>
        </button>)}
    </div>;
}
