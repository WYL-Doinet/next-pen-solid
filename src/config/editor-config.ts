import {
    Circle,
    FabricImage,
    FabricObject,
    Group,
    IText,
    Line,
    Path,
    Rect,
    Triangle,
} from "fabric";

if (!Object.getOwnPropertyDescriptor(FabricObject.prototype, "selected")) {
    Object.defineProperty(FabricObject.prototype, "selected", {
        get: function () {
            return this._selected || false;
        },
        set: function (value) {
            this._selected = value;
        },
        configurable: true,
    });
}

if (!Object.getOwnPropertyDescriptor(FabricObject.prototype, "locked")) {
    Object.defineProperty(FabricObject.prototype, "locked", {
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
        "lockMovementX",
        "lockMovementY",
        "lockScalingX",
        "lockScalingY",
        "lockRotation",
        "selected",
        "locked",
        "selectable",
        "evented",
        "zIndex",
        "name",
    ]);
};

IText.ownDefaults = {
    ...IText.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    lockScalingFlip: true,
    centeredScaling: true,
};

Group.ownDefaults = {
    ...Group.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    lockScalingFlip: true,
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};

Circle.ownDefaults = {
    ...Circle.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    erasable: true,
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};

Line.ownDefaults = {
    ...Line.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};

FabricImage.ownDefaults = {
    ...FabricImage.ownDefaults,
    erasable: false,
    hasControls: true,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    transparentCorners: false,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};

Path.prototype.erasable = true;

Path.ownDefaults = {
    ...Path.ownDefaults,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    centeredScaling: true,
    padding: 10,
};

Rect.ownDefaults = {
    ...Rect.ownDefaults,
    erasable: true,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};

Triangle.ownDefaults = {
    ...Rect.ownDefaults,
    erasable: true,
    hasControls: true,
    transparentCorners: false,
    borderColor: "#3b82f6",
    cornerColor: "#3b82f6",
    cornerSize: 10,
    cornerStyle: "circle",
    strokeUniform: true,
    noScaleCache: false,
    padding: 10,
    centeredScaling: true,
};
