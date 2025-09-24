import EditorBottomMenu from '@/components/editor/editor-bottom-menu';
import EditorCanvas from '@/components/editor/editor-canvas';
import EditorLayout from '@/components/editor/editor-layout';
import EditorTopMenu from '@/components/editor/editor-top-menu';
import { ImageType, NextMode, NextShape } from '@/types';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import '@/config/editor-config';
import { Canvas, loadSVGFromString, PencilBrush, util, Circle, Rect, Triangle, Line } from 'fabric';
import { EraserBrush, ErasingEvent } from '@erase2d/fabric';
import { FabricObject, TDataUrlOptions, TOriginX, TOriginY } from 'node_modules/fabric/dist/fabric';
import { sleep } from '@/libs/utils';

export default function NextPen() {
    const [mode, setMode] = createSignal<NextMode>(NextMode.CURSOR);
    const [zoomScale, setZoomScale] = createSignal<number>(1);

    const erasing = new Map();

    const dimension = { width: 800, height: 800 };

    let canvas!: Canvas;

    let pencilBrush!: PencilBrush;

    let eraserBrush!: EraserBrush;

    const handleDownload = (imageType: ImageType, imageScale: number) => {
        const options: TDataUrlOptions = {
            multiplier: (1 / zoomScale()) * imageScale,
            format: imageType,
            enableRetinaScaling: false,
            quality: 1,
        };

        const dataUrl = canvas.toDataURL(options);

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = new Date().getTime().toString() + '.' + imageType;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleCanvasMode = () => {};

    const calculatePosition = () => {
        const zoom = canvas.getZoom();
        const vp = canvas.viewportTransform;

        const visibleWidth = canvas.width / zoom;
        const visibleHeight = canvas.height / zoom;

        const offsetX = -vp[4] / zoom;
        const offsetY = -vp[5] / zoom;

        return {
            left: offsetX + visibleWidth / 2,
            top: offsetY + visibleHeight / 2,
            originX: 'center',
            originY: 'center',
        };
    };

    const handleFileUpload = (dataUrl: string, type: 'svg' | 'image' = 'image') => {
        if (type === 'svg') {
            loadSVGFromString(dataUrl, function () {}).then((value) => {
                value.objects.forEach((obj) => obj!.set({ strokeUniform: false }));

                const obj = util.groupSVGElements(value.objects as FabricObject[], {
                    ...value.options,
                    objectCaching: false,
                });

                const width = dimension.width * 0.2;
                const height = dimension.width * 0.2;

                const scale = Math.min(width / obj.width, height / obj.height);

                obj.scale(scale);

                const { left, top, originX, originY } = calculatePosition();

                obj.set({
                    left,
                    top,
                    originX: originX,
                    originY: originY,
                });
                canvas.add(obj);
            });
        }
    };

    const worker = new Worker('/worker.js');

    worker.onmessage = function (e) {
        const { id, isErased } = e.data as { id: Number; isErased: Boolean };
        if (isErased) {
            canvas.remove(erasing.get(id));
            erasing.delete(id);
            canvas.requestRenderAll();
        }
    };

    const eraserEnd = async (e: ErasingEvent<'end'>) => {
        e.preventDefault();

        const { path, targets } = e.detail;

        await eraserBrush.commit({ path, targets });

        for (let obj of targets) {
            const imageData = await obj.erase();
            if (imageData) {
                const id = new Date().getTime();
                erasing.set(id, obj);
                worker.postMessage({ id, imageData });
            }
        }
    };

    createEffect(() => {
        canvas = new Canvas('c', {
            isDrawingMode: false,
            backgroundColor: '#ffffff',
            enablePointerEvents: true,
            preserveObjectStacking: true,
            allowTouchScrolling: false,
            width: dimension.width,
            height: dimension.height,
            skipOffscreen: true,
            perPixelTargetFind: false,
        });

        pencilBrush = new PencilBrush(canvas);

        pencilBrush.width = 10;

        eraserBrush = new EraserBrush(canvas);

        eraserBrush.width = 10;

        const container = canvas.upperCanvasEl.parentElement!.parentElement!;

        const scale = Math.min(
            (container.clientWidth * 0.9) / dimension.width,
            (container.clientHeight * 0.9) / dimension.height
        );

        canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale });

        canvas.setZoom(scale);

        setZoomScale(scale);

        canvas.requestRenderAll();
    });

    onCleanup(() => {
        canvas.dispose();
        worker.terminate();
    });

    const handleModeChange = (value: NextMode) => {
        setMode(value);
        switch (value) {
            case NextMode.CURSOR:
                canvas.isDrawingMode = false;
                canvas.freeDrawingBrush = undefined;
                break;
            case NextMode.PENCIL:
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = pencilBrush;
                break;
            default:
                canvas.isDrawingMode = true;
                const newBrush = new EraserBrush(canvas);
                newBrush.width = eraserBrush.width;
                eraserBrush.dispose();
                eraserBrush = newBrush;
                canvas.freeDrawingBrush = newBrush;
                eraserBrush.on('end', eraserEnd);
                break;
        }
    };

    const handleZoomScaleChange = () => {
        let timeout: NodeJS.Timeout;
        return (value: number) => {
            const scale = value / 100;
            setZoomScale(scale);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale });
                canvas.setZoom(scale);
                if (canvas.freeDrawingBrush && canvas.freeDrawingBrush instanceof EraserBrush) {
                    const brushWidth = canvas.freeDrawingBrush.width;
                    eraserBrush.dispose();
                    eraserBrush = new EraserBrush(canvas);
                    eraserBrush.width = brushWidth;
                    canvas.freeDrawingBrush = eraserBrush;
                    eraserBrush.on('end', eraserEnd);
                }
            }, 200);
        };
    };

    const handleShapeAdd = (shape: NextShape) => {
        const { left, top, originX, originY } = calculatePosition();
        switch (shape) {
            case NextShape.CIRCLE:
                const circle = new Circle({
                    radius: dimension.width * 0.1,
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 3,
                    selectable: true,
                    strokeUniform: false,
                    left,
                    top,
                    originX: originX as TOriginX,
                    originY: originY as TOriginY,
                });
                canvas.add(circle);
                canvas.setActiveObject(circle);
                break;
            case NextShape.SQUARE:
                const square = new Rect({
                    width: dimension.width * 0.2,
                    height: dimension.width * 0.2,
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 3,
                    selectable: true,
                    strokeUniform: false,
                    left,
                    top,
                    originX: originX as TOriginX,
                    originY: originY as TOriginY,
                });
                canvas.add(square);
                canvas.setActiveObject(square);
                break;
            case NextShape.TRIANGLE:
                const triangle = new Triangle({
                    width: dimension.width * 0.2,
                    height: dimension.width * 0.2,
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 3,
                    selectable: true,
                    strokeUniform: false,
                    left,
                    top,
                    originX: originX as TOriginX,
                    originY: originY as TOriginY,
                });

                canvas.add(triangle);
                canvas.setActiveObject(triangle);
                break;
            case NextShape.LINE:
                const line = new Line([50, 50, dimension.width * 0.3, dimension.width * 0.3], {
                    stroke: 'black',
                    strokeWidth: 3,
                    selectable: true,
                    strokeUniform: false,
                    left,
                    top,
                    originX: originX as TOriginX,
                    originY: originY as TOriginY,
                    erasable: true,
                });
                canvas.add(line);
                canvas.setActiveObject(line);
                break;
            default:
                break;
        }
        canvas.isDrawingMode = false;
        setMode(NextMode.CURSOR);
    };

    const handlePencilColor = (value: string) => {
        pencilBrush.color = value;
    };

    const handleEraserSize = (value: number) => {
        eraserBrush.width = value;
    };

    const handlePencilSize = (value: number) => {
        pencilBrush.width = value;
    };

    return (
        <EditorLayout>
            <EditorTopMenu
                handleDownload={handleDownload}
                zoomScale={Math.floor(zoomScale() * 100)}
                onZoomScaleChange={handleZoomScaleChange()}
                onFileUpload={handleFileUpload}
            />
            <EditorCanvas />
            <EditorBottomMenu
                onPencilSizeChange={handlePencilSize}
                onPencilColorChange={handlePencilColor}
                mode={mode()}
                onModeChange={handleModeChange}
                onShapeAdd={handleShapeAdd}
                onEraserSizeChange={handleEraserSize}
            />
        </EditorLayout>
    );
}
