import EditorBottomMenu from "@/components/editor/editor-bottom-menu";
import EditorCanvas from "@/components/editor/editor-canvas";
import EditorLayout from "@/components/editor/editor-layout";
import EditorTopMenu from "@/components/editor/editor-top-menu";
import { NextMode, NextShape } from "@/types";
import { createEffect, createSignal, onCleanup } from "solid-js";
import '@/config/editor-config'
import { Canvas, loadSVGFromString, PencilBrush, util, Circle, Rect, Triangle, Line } from "fabric";
import { EraserBrush } from "@erase2d/fabric";
import { FabricObject } from "node_modules/fabric/dist/fabric";


export default function NextPen() {
        const [mode, setMode] = createSignal<NextMode>(NextMode.CURSOR)
        const [zoomScale, setZoomScale] = createSignal<number>(1)

        const dimension = { width: 800, height: 800 }

        let canvasWrapperRef!: HTMLDivElement

        let canvas!: Canvas

        let pencilBrush!: PencilBrush

        const handleCanvasMode = () => {

        }

        const handleFileUpload = (dataUrl: string, type: 'svg' | 'image' = 'image') => {
                if (type === 'svg') {
                        loadSVGFromString(dataUrl, function () { }).then(value => {

                                value.objects.forEach(obj => obj!.set({ strokeUniform: false }))

                                const obj = util.groupSVGElements(value.objects as FabricObject[], { ...value.options, objectCaching: false })

                                const width = dimension.width * 0.2;
                                const height = dimension.width * 0.2;

                                const scale = Math.min(width / obj.width, height / obj.height)

                                obj.scale(scale)

                                canvas.add(obj)
                                canvas.centerObject(obj)

                        })
                }
        }

        createEffect(() => {
                canvas = new Canvas('c', {
                        isDrawingMode: false,
                        backgroundColor: '#ffffff',
                        enablePointerEvents: true,
                        preserveObjectStacking: true,
                        allowTouchScrolling: false,
                });

                pencilBrush = new PencilBrush(canvas);


                const scale = Math.min(canvasWrapperRef.clientWidth / dimension.width, canvasWrapperRef.clientHeight / dimension.height)

                canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale })

                canvas.setZoom(scale)

                setZoomScale(scale)
        })

        onCleanup(() => {
                canvas.dispose()
        })

        const handleModeChange = (value: NextMode) => {
                setMode(value)
                switch (value) {
                        case NextMode.CURSOR:
                                canvas.isDrawingMode = false;
                                break;
                        case NextMode.PENCIL:
                                canvas.isDrawingMode = true,
                                        canvas.freeDrawingBrush = pencilBrush;
                                canvas.freeDrawingBrush.width = 10;
                                canvas.freeDrawingCursor = 'default'
                                break
                        default:
                                canvas.isDrawingMode = true
                                canvas.freeDrawingBrush = new EraserBrush(canvas)
                                canvas.freeDrawingBrush.width = 10
                                canvas.freeDrawingCursor = 'default'
                                break;
                }
        }

        const handleZoomScaleChange = (value: number) => {
                const scale = value / 100
                canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale })
                canvas.setZoom(scale)
                setZoomScale(scale)
        }

        const handleShapeAdd = (shape: NextShape) => {

                switch (shape) {
                        case NextShape.CIRCLE:
                                const circle = new Circle({
                                        radius: dimension.width * 0.1,
                                        fill: 'transparent',
                                        stroke: "black",
                                        strokeWidth: 3,
                                        selectable: true,
                                        strokeUniform: false,
                                });
                                canvas.add(circle)
                                canvas.centerObject(circle)
                                break;
                        case NextShape.SQUARE:
                                const square = new Rect({
                                        width: dimension.width * 0.2,
                                        height: dimension.width * 0.2,
                                        fill: "transparent",
                                        stroke: "black",
                                        strokeWidth: 3,
                                        selectable: true,
                                        strokeUniform: false,
                                })
                                canvas.add(square)
                                canvas.centerObject(square)
                                break;
                        case NextShape.TRIANGLE:
                                const triangle = new Triangle({
                                        width: dimension.width * 0.2,
                                        height: dimension.width * 0.2,
                                        fill: "transparent",
                                        stroke: "black",
                                        strokeWidth: 3,
                                        selectable: true,
                                        strokeUniform: false,
                                });

                                canvas.add(triangle)
                                canvas.centerObject(triangle)
                                break;
                        case NextShape.LINE:
                                const line = new Line([50, 50, dimension.width * 0.3, dimension.width * 0.3], {
                                        stroke: 'black',
                                        strokeWidth: 3,
                                        selectable: true,
                                        strokeUniform: false,
                                });
                                canvas.add(line)
                                canvas.centerObject(line)
                                break;
                        default:
                                break;
                }
        }

        return <EditorLayout>
                <EditorTopMenu zoomScale={Math.floor(zoomScale() * 100)} onZoomScaleChange={handleZoomScaleChange} onFileUpload={handleFileUpload}></EditorTopMenu>
                <EditorCanvas ref={canvasWrapperRef} />
                <EditorBottomMenu mode={mode()} onModeChange={handleModeChange} onShapeAdd={handleShapeAdd}></EditorBottomMenu>
        </EditorLayout>
}