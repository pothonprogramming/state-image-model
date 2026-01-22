(() => {

    function handleAnimationFrameRequest(timeStamp) {
        if (SimpleModel.update(timeStamp)) if (SimpleModel.render()) render();

        animmationFrameRequestId = window.requestAnimationFrame(handleAnimationFrameRequest);
        //window.cancelAnimationFrame(animmationFrameRequestId);
    }

    function handleMouseDownOrMouseUp(event) {
        SimpleModel.setMousePosition(Math.floor(event.clientX - canvasRectangle.left), Math.floor(event.clientY - canvasRectangle.top));
        const mouseDown = event.type === "mousedown";
        switch (event.button) {
            case 0:
                SimpleModel.setMouseLeft(mouseDown);
                break;
            case 2:
                SimpleModel.setMouseRight(mouseDown);
                break;
        }
    }

    function handleMouseMove(event) {
        const scale = canvasRectangle.width / SimpleModel.getDisplayWidth();
        const mouse_x = Math.floor((event.clientX - canvasRectangle.left) / scale);
        const mouse_y = Math.floor((event.clientY - canvasRectangle.top) / scale);
        SimpleModel.setMousePosition(mouse_x, mouse_y);
    }

    function handleWindowResize(event) {
        const windowInnerWidth = event.target.innerWidth;
        const windowInnerHeight = event.target.innerHeight;

        canvasContext2D.imageSmoothingEnabled = false;

        canvasRectangle = canvas.getBoundingClientRect();

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

    let canvasRectangle = canvas.getBoundingClientRect();

    let displayView; // The typed array view that holds the raw pixel data
    let imageData; // The ImageData object that will be used to draw the pixel data to the canvas

    SimpleModel.initialize(Math.random() * 1000);

    resetImageData();

    document.body.appendChild(canvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseDownOrMouseUp);
    window.addEventListener("resize", handleWindowResize);
    window.dispatchEvent(new Event("resize"));

    animationFrameRequestId = window.requestAnimationFrame(handleAnimationFrameRequest);

})()