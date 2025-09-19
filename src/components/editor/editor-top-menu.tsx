import { CornerUpLeft, CornerUpRight, FileDown, PaperclipIcon, RabbitIcon } from 'lucide-solid';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuGroupLabel,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { DropdownMenuSubTriggerProps } from '@kobalte/core/dropdown-menu';
import { createSignal } from 'solid-js';
import { ImageType } from '@/types';

interface EditorTopMenuProps {
    onFileUpload: (dataUrl: string, type: 'svg' | 'image') => void;
    zoomScale: number;
    onZoomScaleChange: (value: number) => void;
    handleDownload: (imageType: ImageType, imageScale: number) => void;
}

export default function EditorTopMenu(props: EditorTopMenuProps) {
    const [imageScale, setImageScale] = createSignal(1);
    const [imageType, setImageType] = createSignal<ImageType | null>(ImageType.JPEG);

    const handleFileChange = (e: Event, type: 'svg' | 'image') => {
        const el = e.target as HTMLInputElement;
        if (el.files) {
            const file = el.files[0] as File;

            const reader = new FileReader();

            reader.onload = function (e) {
                props.onFileUpload(e.target!.result as string, type);
            };

            if (type === 'svg') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <div class="py-2.5 px-3 flex justify-between items-center flex-wrap gap-3">
            <div class="flex items-center gap-4 flex-1 max-w-2xl">
                <div class="flex items-center rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <button class="p-2 hover:bg-gray-200 rounded-l-lg transition-colors" title="Undo">
                        <CornerUpLeft size={18} class="text-gray-600" />
                    </button>
                    <div class="w-px h-6 bg-gray-300"></div>
                    <button class="p-2 hover:bg-gray-200 rounded-r-lg transition-colors" title="Redo">
                        <CornerUpRight size={18} class="text-gray-600" />
                    </button>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                    <input
                        value={props.zoomScale}
                        onInput={(e) => props.onZoomScaleChange(Number(e.target.value))}
                        type="range"
                        class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        min={1}
                        max={500}
                        step={1}
                    />
                    <span class="font-medium text-sm text-gray-700 min-w-[45px] text-center">{props.zoomScale}%</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <Button title="svg" class="flex gap-1.5 relative">
                    <RabbitIcon size={18} />
                    <input
                        onchange={(e) => {
                            handleFileChange(e, 'svg');
                        }}
                        type="file"
                        class="absolute top-0 left-0 w-full h-full inset-0 opacity-0"
                    />
                </Button>
                <Button title="upload" class="flex gap-1.5">
                    <PaperclipIcon size={18} />{' '}
                </Button>
                <DropdownMenu placement="bottom">
                    <DropdownMenuTrigger
                        as={(menuProps: DropdownMenuSubTriggerProps) => {
                            return (
                                <Button title="export" class="flex gap-1.5 " {...menuProps}>
                                    <FileDown size={18} />{' '}
                                </Button>
                            );
                        }}
                    ></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuGroupLabel class="space-y-2" aria-hidden={false}>
                                <label class="text-xs font-medium block">File Type</label>
                                <Select
                                    onChange={(value) => {
                                        setImageType(value);
                                    }}
                                    value={imageType()}
                                    options={Object.values(ImageType)}
                                    itemComponent={(props) => (
                                        <SelectItem class="font-medium" item={props.item}>
                                            {props.item.rawValue}
                                        </SelectItem>
                                    )}
                                >
                                    <SelectTrigger>
                                        <SelectValue<string> class="font-medium">
                                            {(state) => state.selectedOption()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent />
                                </Select>
                                <label class="font-medium text-xs">Size</label>
                                <div class="flex items-center gap-2.5">
                                    <input
                                        min={0.5}
                                        max={3.5}
                                        step={0.12}
                                        value={imageScale()}
                                        oninput={(e) => setImageScale(Number(e.target.value))}
                                        type="range"
                                        class="bg-gray-200  w-[250px] rounded-lg h-2 appearance-none cursor-pointer slider"
                                    />
                                    <div class="p-1 border text-center min-w-[50px] rounded-md">{imageScale()}</div>
                                </div>
                                <div class="font-light text-xs">
                                    {Math.floor(800 * imageScale())}x{Math.floor(800 * imageScale())}
                                </div>
                            </DropdownMenuGroupLabel>
                            <DropdownMenuItem class="pointer-events-none">
                                <Button
                                    class="w-full pointer-events-auto"
                                    size={'sm'}
                                    onclick={() => {
                                        props.handleDownload(imageType() || ImageType.JPEG, imageScale());
                                    }}
                                >
                                    Download
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
