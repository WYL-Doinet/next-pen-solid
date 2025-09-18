import { CornerUpLeft, CornerUpRight, FileDown, PaperclipIcon, RabbitIcon } from "lucide-solid";
import { Button } from "../ui/button";
import { NextMode } from "@/types";

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

    return <div class="py-2.5 px-3 flex justify-between items-center">

        <div class="flex items-center gap-2">
            <h1 class=" italic  font-extrabold text-xl">Next Pen</h1>

        </div>
        <div class="flex items-center gap-4 flex-1 justify-center max-w-2xl mx-4">
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
                    min={25}
                    max={400}
                    step={5}
                />
                <span class="font-medium text-sm text-gray-700 min-w-[45px] text-center">
                    {props.zoomScale}%
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <Button class="flex gap-1 relative"><RabbitIcon size={20} /> Svg
                <input onchange={(e) => {
                    handleFileChange(e, 'svg')
                }} type="file" class="absolute top-0 left-0 w-full h-full inset-0 opacity-0" />
            </Button>
            <Button class="flex gap-1"><PaperclipIcon size={20} /> Upload</Button>
            <Button class="flex gap-1"><FileDown size={20} /> Export</Button>
        </div>
    </div>
}