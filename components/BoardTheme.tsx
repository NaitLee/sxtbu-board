import { THEMES } from "../common/utils.tsx";

export default function BoardTheme({ name }: { name: string }) {
    const theme = THEMES[name as keyof typeof THEMES];
    return <style>{theme ? `
        :root .board {
            --board-back: ${theme[0]};
            --board-stroke: ${theme[1]};
            --logo-filter: ${theme[2]};
        }
    ` : ''}</style>;
}
