import EditorBottomMenu from '@/components/editor/editor-bottom-menu';
import EditorCanvas from '@/components/editor/editor-canvas';
import EditorLayout from '@/components/editor/editor-layout';
import EditorTopMenu from '@/components/editor/editor-top-menu';
import { ImageType, NextMode, NextShape } from '@/types';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import '@/config/editor-config';
import { Canvas, loadSVGFromString, PencilBrush, util, Circle, Rect, Triangle, Line } from 'fabric';
import { EraserBrush } from '@erase2d/fabric';
import {
    CircleProps,
    FabricObject,
    TDataUrlOptions,
    TOptions,
    TOriginX,
    TOriginY,
} from 'node_modules/fabric/dist/fabric';

export default function NextPen() {
    const [mode, setMode] = createSignal<NextMode>(NextMode.CURSOR);
    const [zoomScale, setZoomScale] = createSignal<number>(1);

    const dimension = { width: 800, height: 800 };

    let canvasWrapperRef!: HTMLDivElement;

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

                canvas.add(obj);
                canvas.centerObject(obj);
            });
        }
    };

    createEffect(() => {
        canvas = new Canvas('c', {
            isDrawingMode: false,
            backgroundColor: '#ffffff',
            enablePointerEvents: true,
            preserveObjectStacking: true,
            allowTouchScrolling: false,
        });

        pencilBrush = new PencilBrush(canvas);

        pencilBrush.width = 10;

        eraserBrush = new EraserBrush(canvas);

        eraserBrush.width = 10;

        canvas.freeDrawingCursor = 'default';

        const scale = Math.min(
            (canvasWrapperRef.clientWidth * 0.9) / dimension.width,
            (canvasWrapperRef.clientHeight * 0.9) / dimension.height
        );

        canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale });

        canvas.setZoom(scale);

        setZoomScale(scale);
    });

    onCleanup(() => {
        canvas.dispose();
    });

    const handleModeChange = (value: NextMode) => {
        setMode(value);
        switch (value) {
            case NextMode.CURSOR:
                canvas.isDrawingMode = false;
                break;
            case NextMode.PENCIL:
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = pencilBrush;
                break;
            default:
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = eraserBrush;
                break;
        }
    };

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

    const handleZoomScaleChange = (value: number) => {
        const scale = value / 100;
        setZoomScale(scale);
        canvas.setDimensions({ width: dimension.width * scale, height: dimension.height * scale });
        canvas.setZoom(scale);
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
                canvas.centerObject(square);
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
                onZoomScaleChange={handleZoomScaleChange}
                onFileUpload={handleFileUpload}
            />
            <EditorCanvas ref={canvasWrapperRef} />
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
