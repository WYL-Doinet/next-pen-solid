import { CornerUpLeft, CornerUpRight, FileDown, PaperclipIcon, RabbitIcon } from "lucide-solid";
import { Button } from "../ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuGroupLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuSubTriggerProps } from "@kobalte/core/dropdown-menu";

interface EditorTopMenuProps {
    onFileUpload: (dataUrl: string, type: 'svg' | 'image') => void,
    zoomScale: number,
    onZoomScaleChange: (value: number) => void
}

export default function EditorTopMenu(props: EditorTopMenuProps) {

    const handleFileChange = (e: Event, type: 'svg' | 'image') => {
        const el = e.target as HTMLInputElement
        if (el.files) {
            const file = el.files[0] as File

            const reader = new FileReader()

            reader.onload = function (e) {
                props.onFileUpload(e.target!.result as string, type)
            }

            if (type === 'svg') {
                reader.readAsText(file)
            } else {
                reader.readAsDataURL(file)
            }
        }
    }

    return <div class="py-2.5 px-3 flex justify-between items-center flex-wrap gap-3">

        <div class="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Undo/Redo Controls */}
            <div class="flex items-center rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                <button class="p-2 hover:bg-gray-200 rounded-l-lg transition-colors" title="Undo">
                    <CornerUpLeft size={18} class="text-gray-600" />
                </button>
                <div class="w-px h-6 bg-gray-300"></div>
                <button class="p-2 hover:bg-gray-200 rounded-r-lg transition-colors" title="Redo">
                    <CornerUpRight size={18} class="text-gray-600" />
                </button>
            </div>

            {/* Zoom Controls */}
            <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                <label class="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Zoom:
                </label>
                <input
                    value={props.zoomScale}
                    onInput={(e) => props.onZoomScaleChange(parseInt(e.target.value, 10))}
                    type="range"
                    class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    min={1}
                    max={500}
                    step={1}
                />
                <span class="font-medium text-sm text-gray-700 min-w-[45px] text-center">
                    {props.zoomScale}%
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <Button title="svg" class="flex gap-1.5 relative"><RabbitIcon size={18} /> 
                <input onchange={(e) => {
                    handleFileChange(e, 'svg')
                }} type="file" class="absolute top-0 left-0 w-full h-full inset-0 opacity-0" />
            </Button>
            <Button title="upload" class="flex gap-1.5"><PaperclipIcon size={18} /> </Button>
            <DropdownMenu placement="bottom">
                <DropdownMenuTrigger as={(menuProps: DropdownMenuSubTriggerProps) => {
                    return <Button title="export" class="flex gap-1.5 " {...menuProps}><FileDown size={18} /> </Button>
                }}>

                </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuGroup>
                        <DropdownMenuGroupLabel class="space-y-2">
                            <div>Adjust Size</div>
                            <div class="flex items-center gap-2.5">
                                <input max={100} type="range" class="bg-gray-200  w-[250px] rounded-lg h-2 appearance-none cursor-pointer slider" />
                                <div class="p-4 border min-w-[80px] rounded-md"></div>
                            </div>
                        </DropdownMenuGroupLabel>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    </div>
}