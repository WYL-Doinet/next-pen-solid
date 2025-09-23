self.onmessage = function (e) {
    const { id, imageData } = e.data;

    let isErased = true;

    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] !== 0 && imageData[i] !== 255) {
            isErased = false;
        }
    }

    self.postMessage({ id, isErased });
};
