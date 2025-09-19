interface EditorCanvasProps {
    ref: HTMLDivElement;
}

export default function EditorCanvas(props: EditorCanvasProps) {
    return (
        <div class="flex-1 bg-gray-100 p-2.5 overflow-hidden ">
            <div ref={props.ref} class="w-full h-full  flex justify-center overflow-hidden  items-center rounded">
                <canvas id="c"></canvas>
            </div>
        </div>
    );
}
