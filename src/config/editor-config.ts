import { Circle, FabricImage, FabricObject, Group, IText, Line, Path, Rect, StaticCanvas, Triangle } from 'fabric';

declare module 'fabric' {
    interface FabricObject {
        erase: () => Promise<Uint8ClampedArray<ArrayBufferLike> | boolean>;
    }
}

if (!Object.getOwnPropertyDescriptor(FabricObject.prototype, 'selected')) {
    Object.defineProperty(FabricObject.prototype, 'selected', {
        get: function () {
            return this._selected || false;
        },
        set: function (value) {
            this._selected = value;
        },
        configurable: true,
    });
}

if (!Object.getOwnPropertyDescriptor(FabricObject.prototype, 'locked')) {
    Object.defineProperty(FabricObject.prototype, 'locked', {
        get: function () {
            return this._locked || false;
        },
        set: function (value) {
            this._locked = value;

            this.set({
                lockMovementX: value,
                lockMovementY: value,
                lockScalingX: value,
                lockScalingY: value,
                lockRotation: value,
                lockScalingFlip: value,
                lockSkewingX: value,
                lockSkewingY: value,
                erasable: !value,
            });
        },
        configurable: true,
    });
}

const originalToObject = FabricObject.prototype.toObject;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
FabricObject.prototype.toObject = function (propertiesToInclude: any[] = []) {
    return originalToObject.call(this, [
        ...propertiesToInclude,
        'lockMovementX',
        'lockMovementY',
        'lockScalingX',
        'lockScalingY',
        'lockRotation',
        'selected',
        'locked',
        'selectable',
        'evented',
        'zIndex',
        'name',
    ]);
};

FabricObject.prototype.erase = async function () {
    if (!this.clipPath) return false;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const bounds = this.getBoundingRect();
    canvas.width = bounds.width;
    canvas.height = bounds.height;

    const tempObj = await this.clone();
    const clipPath = await this.clipPath.clone();

    tempObj.set({ left: 0, top: 0, originX: 'left', originY: 'top', clipPath, backgroundColor: undefined });

    // tempObj.clipPath!.absolutePositioned = true;

    const tempCanvas = new StaticCanvas(canvas, { backgroundColor: undefined });

    tempCanvas.setDimensions({ width: canvas.width, height: canvas.height });
    tempCanvas.add(tempObj);
    tempCanvas.renderAll();

    return ctx.getImageData(0, 0, canvas.width, canvas.height,).data;
};

IText.ownDefaults = {
    ...IText.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    lockScalingFlip: true,
    centeredScaling: true,
    objectCaching: true,
};

Group.ownDefaults = {
    ...Group.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    lockScalingFlip: true,
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
};

Circle.ownDefaults = {
    ...Circle.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    erasable: true,
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
};

Line.ownDefaults = {
    ...Line.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
};

FabricImage.ownDefaults = {
    ...FabricImage.ownDefaults,
    erasable: false,
    hasControls: true,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    transparentCorners: false,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
};

Path.prototype.erasable = true;

Path.ownDefaults = {
    ...Path.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    centeredScaling: true,
    padding: 10,
    objectCaching: true,
};

Rect.ownDefaults = {
    ...Rect.ownDefaults,
    erasable: true,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
    backgroundColor: 'transparent',
};

Triangle.ownDefaults = {
    ...Rect.ownDefaults,
    erasable: true,
    hasControls: true,
    transparentCorners: false,
    borderColor: '#3b82f6',
    cornerColor: '#3b82f6',
    cornerSize: 10,
    cornerStyle: 'circle',
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
    objectCaching: true,
};
