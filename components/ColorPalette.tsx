import { useState } from "preact/hooks";
import { DEF_STROKE_COLOR, toggleClassName } from "../common/utils.tsx";

interface ColorPaletteProps {
    colors: string[];
    dispatch: (color: string) => void;
}

export default function ColorPalette({ colors, dispatch }: ColorPaletteProps) {
    const [selected, set_selected] = useState<string>(DEF_STROKE_COLOR);
    const onclick = (event: Event) => {
        //@ts-ignore:
        const color = event.currentTarget.value;
        dispatch(color);
        set_selected(color);
    };
    return <div class="board__color-palette">
        {colors.map(color => <button class={toggleClassName("board__color-palette__palette", { '--selected': selected === color })}
            value={color} style={`background-color:${color}`} onClick={onclick}></button>)}
    </div>;
}
