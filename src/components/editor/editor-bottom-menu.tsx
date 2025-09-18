import { CircleIcon, EraserIcon, MousePointer2Icon, MoveUpRightIcon, PencilIcon, Slash, SquareIcon, TriangleIcon } from "lucide-solid";
import { Button } from "../ui/button";
import { NextMode, NextShape } from "@/types";
import { For, JSX } from "solid-js";

interface EditorBottomMenuProps {
    mode: NextMode,
    onModeChange: (value: NextMode) => void
    onShapeAdd: (shape: NextShape) => void
}

export default function EditorBottomMenu(props: EditorBottomMenuProps) {

    const nextMode: { icon: JSX.Element, type: NextMode }[] = [
        { icon: <MousePointer2Icon size={20} />, type: NextMode.CURSOR },
        { icon: <PencilIcon size={20} />, type: NextMode.PENCIL },
        { icon: <EraserIcon size={20} />, type: NextMode.ERASER },
    ]

    const nextShape: { icon: JSX.Element, type: NextShape }[] = [
        { icon: <Slash size={20} />, type: NextShape.LINE },
        { icon: <CircleIcon size={20} />, type: NextShape.CIRCLE },
        { icon: <SquareIcon size={20} />, type: NextShape.SQUARE },
        { icon: <TriangleIcon size={20} />, type: NextShape.TRIANGLE },
        { icon: <MoveUpRightIcon size={20} />, type: NextShape.ARROW },

    ]
    return <div class="py-2.5 px-3 flex items-center gap-2">
        <div class="p-2 rounded-md bg-gary-50 bg-gray-100 text-gray-700 flex gap-1">
            <For each={nextMode}>
                {(item) => <Button onclick={() => props.onModeChange(item.type)} variant={props.mode === item.type ? 'default' : 'ghost'} size={'mode'}>
                    {item.icon}
                </Button>}
            </For>
        </div>
        <div class="p-2 rounded-md bg-gary-50 bg-gray-100 text-gray-700 flex gap-1">
            <Button size={'mode'} class="relative">
                <input type="color" class="absolute top-0 left-0 bottom-0 right-0 w-full h-full opacity-0" />
            </Button>
            <For each={nextShape}>
                {(item) => <Button onclick={() => props.onShapeAdd(item.type)} variant={'ghost'} size={'mode'}>
                    {item.icon}
                </Button>}
            </For>
        </div>
    </div>
}