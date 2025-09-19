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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuGroupLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DropdownMenuSubTriggerProps } from '@kobalte/core/dropdown-menu';

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

    const [openMenu, setOpenMenu] = createSignal<NextMode | undefined>(undefined);

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
                                    <DropdownMenu
                                        open={openMenu() === NextMode.ERASER}
                                        placement="top"
                                        onOpenChange={(value) => {
                                            if (value) {
                                                props.onModeChange(NextMode.ERASER);
                                            }
                                            setOpenMenu(value ? NextMode.ERASER : undefined);
                                        }}
                                    >
                                        <DropdownMenuTrigger
                                            as={(menuProps: DropdownMenuSubTriggerProps) => (
                                                <Button
                                                    variant={props.mode === item.type ? 'default' : 'ghost'}
                                                    size={'sm'}
                                                    {...menuProps}
                                                >
                                                    {item.icon}
                                                </Button>
                                            )}
                                        />
                                        <DropdownMenuContent class="w-56">
                                            <DropdownMenuGroup>
                                                <DropdownMenuGroupLabel class="space-y-1">
                                                    <div>Pick Size</div>
                                                    <div class="flex items-center gap-2.5">
                                                        <input
                                                            value={eraserSize()}
                                                            max={100}
                                                            oninput={(e) => {
                                                                handleEraserSize(parseInt(e.target.value, 10));
                                                            }}
                                                            type="range"
                                                            class="bg-gray-200  w-35 rounded-lg h-2 appearance-none cursor-pointer slider"
                                                        />
                                                        <span>{eraserSize()} px</span>
                                                    </div>
                                                </DropdownMenuGroupLabel>
                                                {/* <DropdownMenuSeparator /> */}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );

                            case NextMode.PENCIL:
                                return (
                                    <DropdownMenu
                                        placement="top"
                                        open={openMenu() === NextMode.PENCIL}
                                        onOpenChange={(value) => {
                                            if (value) {
                                                props.onModeChange(NextMode.PENCIL);
                                            }

                                            setOpenMenu(value ? NextMode.PENCIL : undefined);
                                        }}
                                    >
                                        <DropdownMenuTrigger
                                            as={(menuProps: DropdownMenuSubTriggerProps) => (
                                                <Button
                                                    variant={props.mode === item.type ? 'default' : 'ghost'}
                                                    size={'sm'}
                                                    {...menuProps}
                                                >
                                                    {item.icon}
                                                </Button>
                                            )}
                                        />
                                        <DropdownMenuContent class="w-56">
                                            <DropdownMenuGroup>
                                                <DropdownMenuGroupLabel
                                                    class="flex items-center gap-2.5"
                                                    aria-hidden={false}
                                                >
                                                    <span>Pick color</span>
                                                    <div
                                                        class="flex relative  gap-2 items-center flex-1 h-5 rounded-md"
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
                                                </DropdownMenuGroupLabel>
                                                <DropdownMenuSeparator />
                                                <For each={colors}>
                                                    {(item) => (
                                                        <DropdownMenuItem>
                                                            <div
                                                                class="flex gap-2.5"
                                                                onclick={() => handlePencilColor(item.hex)}
                                                            >
                                                                <div
                                                                    class="size-5"
                                                                    style={{ 'background-color': item.hex }}
                                                                ></div>
                                                                <span>{item.label}</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    )}
                                                </For>
                                            </DropdownMenuGroup>
                                            <DropdownMenuGroup>
                                                <DropdownMenuGroupLabel class="space-y-1" aria-hidden={false}>
                                                    <div>Pick Size</div>
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
                                                        <span>{pencilSize()} px</span>
                                                    </div>
                                                </DropdownMenuGroupLabel>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
