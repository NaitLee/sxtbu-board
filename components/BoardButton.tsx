import { toggleClassName } from "../common/utils.tsx";
import Icon, { type IconKey } from "./Icon.tsx";

interface ButtonProps {
    icon: IconKey;
    label: string;
    onClick: (event: MouseEvent) => void;
    selected?: boolean;
    hidden?: boolean;
    value?: string;
}

export default function BoardButton({ icon, label, onClick, selected, hidden, value }: ButtonProps) {
    const preventdefault = (event: Event) => event.preventDefault();
    return <button onClick={onClick} value={value} onContextMenu={preventdefault} onDblClick={preventdefault}
        class={toggleClassName('board__menu-button', { '--selected': selected, '--hidden': hidden })}
    >
        <Icon name={icon} />
        <span>{label}</span>
    </button>;
}
