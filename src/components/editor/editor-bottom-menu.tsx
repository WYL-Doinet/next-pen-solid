import {
    CircleIcon,
    EraserIcon,
    MousePointer2Icon,
    MoveUpRightIcon,
    PencilIcon,
    Slash,
    SquareIcon,
    TriangleIcon,
} from 'lucide-solid';
import { Button } from '../ui/button';
import { NextMode, NextShape } from '@/types';
import { createSignal, For, JSX } from 'solid-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { PopoverTriggerProps } from '@kobalte/core/popover';

interface EditorBottomMenuProps {
    mode: NextMode;
    onModeChange: (value: NextMode) => void;
    onShapeAdd: (shape: NextShape) => void;
    onPencilColorChange: (value: string) => void;
    onEraserSizeChange: (value: number) => void;
    onPencilSizeChange: (value: number) => void;
}

export default function EditorBottomMenu(props: EditorBottomMenuProps) {
    const [pencilColor, setPencilColor] = createSignal('#000000');

    const [pencilSize, setPencilSize] = createSignal(10);

    const [eraserSize, setEraserSize] = createSignal(10);

    const nextMode: { icon: JSX.Element; type: NextMode }[] = [
        { icon: <MousePointer2Icon size={15} />, type: NextMode.CURSOR },
        { icon: <PencilIcon size={15} />, type: NextMode.PENCIL },
        { icon: <EraserIcon size={15} />, type: NextMode.ERASER },
    ];

    const nextShape: { icon: JSX.Element; type: NextShape }[] = [
        { icon: <Slash size={15} />, type: NextShape.LINE },
        { icon: <CircleIcon size={15} />, type: NextShape.CIRCLE },
        { icon: <SquareIcon size={15} />, type: NextShape.SQUARE },
        { icon: <TriangleIcon size={15} />, type: NextShape.TRIANGLE },
        { icon: <MoveUpRightIcon size={15} />, type: NextShape.ARROW },
    ];

    const colors = [
        { label: 'Red', hex: '#FF0000' },
        { label: 'Green', hex: '#00FF00' },
        { label: 'Blue', hex: '#0000FF' },
        { label: 'Purple', hex: '#800080' },
        { label: 'Orange', hex: '#FFA500' },
    ];

    const handlePencilColor = (value: string) => {
        setPencilColor(value);
        props.onPencilColorChange(value);
    };

    const handleEraserSize = (value: number) => {
        setEraserSize(value);
        props.onEraserSizeChange(value);
    };

    const handlePencilSize = (value: number) => {
        setPencilSize(value);
        props.onPencilSizeChange(value);
    };

    return (
        <div class="py-2.5 px-3 flex items-center gap-2 overflow-y-auto">
            <div class="p-2 rounded-md bg-gary-50 bg-gray-100 text-gray-700 flex gap-1">
                <For each={nextMode}>
                    {(item) => {
                        switch (item.type) {
                            case NextMode.ERASER:
                                return (
                                    <Popover placement="top">
                                        <PopoverTrigger
                                            onClick={() => props.onModeChange(NextMode.ERASER)}
                                            as={(menuProps: PopoverTriggerProps) => (
                                                <Button
                                                    variant={props.mode === item.type ? 'default' : 'ghost'}
                                                    size={'sm'}
                                                    {...menuProps}
                                                >
                                                    {item.icon}
                                                </Button>
                                            )}
                                        />

                                        <PopoverContent class="w-60" onOpenAutoFocus={(e) => e.preventDefault()}>
                                            <div class="text-xs font-medium">Width</div>
                                            <div class="flex items-center gap-2.5">
                                                <input
                                                    value={eraserSize()}
                                                    max={100}
                                                    oninput={(e) => {
                                                        handleEraserSize(parseInt(e.target.value, 10));
                                                    }}
                                                    type="range"
                                                    class="bg-gray-200 w-38 rounded-lg h-2 appearance-none cursor-pointer slider"
                                                />
                                                <span class="text-sm font-medium">{eraserSize()} px</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                );

                            case NextMode.PENCIL:
                                return (
                                    <Popover placement="top">
                                        <PopoverTrigger
                                            onClick={() => props.onModeChange(NextMode.PENCIL)}
                                            as={(menuProps: PopoverTriggerProps) => (
                                                <Button
                                                    variant={props.mode === item.type ? 'default' : 'ghost'}
                                                    size={'sm'}
                                                    {...menuProps}
                                                >
                                                    {item.icon}
                                                </Button>
                                            )}
                                        />
                                        <PopoverContent class="w-56 space-y-1.5" onOpenAutoFocus={(e) => e.preventDefault()}>
                                            <div class="flex items-center gap-2.5 ">
                                                <div class="text-xs  font-medium">Color</div>
                                                <div
                                                    class="flex relative  gap-2 items-center flex-1 h-5  rounded"
                                                    style={{ 'background-color': pencilColor() }}
                                                >
                                                    <input
                                                        class="absolute top-0 left-0 w-full h-full opacity-0"
                                                        oninput={(e) => {
                                                            handlePencilColor(e.target.value);
                                                        }}
                                                        type="color"
                                                    />
                                                </div>
                                            </div>
                                            <For each={colors}>
                                                {(item) => (
                                                    <div
                                                        class="flex gap-2.5 space-y-2"
                                                        onclick={() => handlePencilColor(item.hex)}
                                                    >
                                                        <div
                                                            class="size-5"
                                                            style={{ 'background-color': item.hex }}
                                                        ></div>
                                                        <span class="text-xs">{item.label}</span>
                                                    </div>
                                                )}
                                            </For>

                                            <div class="space-y-1">
                                                <div class="text-xs font-medium">Width</div>
                                                <div class="flex items-center gap-2.5">
                                                    <input
                                                        value={pencilSize()}
                                                        max={100}
                                                        oninput={(e) => {
                                                            handlePencilSize(parseInt(e.target.value, 10));
                                                        }}
                                                        type="range"
                                                        class="bg-gray-200  w-35 rounded-lg h-2 appearance-none cursor-pointer slider"
                                                    />
                                                    <span class="text-sm font-medium">{pencilSize()} px</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                );

                            default:
                                return (
                                    <Button
                                        onclick={() => props.onModeChange(item.type)}
                                        variant={props.mode === item.type ? 'default' : 'ghost'}
                                        size={'sm'}
                                    >
                                        {item.icon}
                                    </Button>
                                );
                        }
                    }}
                </For>
            </div>
            <div class="p-2 rounded-md bg-gary-50 bg-gray-100 text-gray-700 flex gap-1">
                <For each={nextShape}>
                    {(item) => (
                        <Button onclick={() => props.onShapeAdd(item.type)} variant={'ghost'} size={'sm'}>
                            {item.icon}
                        </Button>
                    )}
                </For>
            </div>
        </div>
    );
}
