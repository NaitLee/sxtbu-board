
import IconHandMove from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/hand-move.tsx";
import IconPencil from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/pencil.tsx";
import IconArrowBackUp from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-back-up.tsx";
import IconTrashX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/trash-x.tsx";
import IconCast from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/cast.tsx";
import IconPlanet from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/planet.tsx";
import IconBrandBaidu from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-baidu.tsx";
import IconSearch from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/search.tsx";
import IconBrandWechat from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-wechat.tsx";
import IconAffiliate from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/affiliate.tsx";
import IconEraser from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/eraser.tsx";
import IconPlus from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/plus.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-left.tsx";
import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-right.tsx";
import IconAdjustmentsHorizontal from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/adjustments-horizontal.tsx";
import IconArrowsMaximize from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-maximize.tsx";
import IconArrowsMinimize from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-minimize.tsx";
import IconCloudShare from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/cloud-share.tsx";

export type IconKey = keyof typeof Icons;

export interface IconProps {
    name: IconKey;
    size?: number;
    color?: string;
    stroke?: number;
}

export const Icons = {
    'hand-move': IconHandMove,
    'pencil': IconPencil,
    'arrow-back-up': IconArrowBackUp,
    'trash-x': IconTrashX,
    'cast': IconCast,
    'planet': IconPlanet,
    'brand-baidu': IconBrandBaidu,
    'search': IconSearch,
    'brand-wechat': IconBrandWechat,
    'affiliate': IconAffiliate,
    'eraser': IconEraser,
    'plus': IconPlus,
    'arrow-left': IconArrowLeft,
    'arrow-right': IconArrowRight,
    'adjustments-horizontal': IconAdjustmentsHorizontal,
    'arrows-maximize': IconArrowsMaximize,
    'arrows-minimize': IconArrowsMinimize,
    'cloud-share': IconCloudShare,
};

export default function Icon(props: IconProps) {
    const I = Icons[props.name];
    return <I {...props} />;
}
