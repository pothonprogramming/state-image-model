(() => {

    function handleWindowResize(event) {
        const windowInnerWidth = event.target.innerWidth;
        const windowInnerHeight = event.target.innerHeight;

        canvasContext2D.imageSmoothingEnabled = false;

        canvas.style.position = "fixed";
        canvas.style.left = Math.floor((windowInnerWidth - canvas.width) * 0.5) + "px";
        canvas.style.top = Math.floor((windowInnerHeight - canvas.height) * 0.5) + "px";

        resetImageData();

        render();
    }

    function render() {
        SimpleModel.render();
        canvasContext2D.putImageData(imageData, 0, 0);
    }

    function resetImageData() {
        displayView = new Uint8ClampedArray(SimpleModel.getDisplayPixels().buffer, 0, SimpleModel.getDisplayPixelCount() * 4);
        imageData = new ImageData(displayView, SimpleModel.getDisplayWidth(), SimpleModel.getDisplayHeight());
    }

    const canvas = document.createElement("canvas");
    canvas.height = SimpleModel.getDisplayHeight();
    canvas.width = SimpleModel.getDisplayWidth();
    const canvasContext2D = canvas.getContext("2d");
    canvasContext2D.imageSmoothingEnabled = false;

    let displayView; // The typed array view that holds the raw pixel data
    let imageData; // The ImageData object that will be used to draw the pixel data to the canvas

    resetImageData();

    document.body.appendChild(canvas);
    window.addEventListener("resize", handleWindowResize);
    window.dispatchEvent(new Event("resize"));

})()