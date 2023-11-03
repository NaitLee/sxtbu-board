import type { ComponentChildren } from "preact";

interface MenuOptionProps {
    label: string;
    children?: ComponentChildren;
}

export default function MenuOption({ label, children }: MenuOptionProps) {
    return <dl class="board__dl">
        <dt class="board__dt">{label}</dt>
        <dd class="board__dd">
            {children}
        </dd>
    </dl>;
}
