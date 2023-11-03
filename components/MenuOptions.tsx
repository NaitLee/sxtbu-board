import type { ComponentChildren } from "preact";
import { toggleClassName } from "../common/utils.tsx";

interface MenuOptionsProps {
    children?: ComponentChildren;
    visible?: boolean;
}

export default function MenuOptions({ children, visible }: MenuOptionsProps) {
    return <div class={toggleClassName("board__menu-options", { '--hidden': !visible })}>
        {children}
    </div>;
}
