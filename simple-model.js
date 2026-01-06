///////////////////////
// ABOUT SimpleModel //
///////////////////////
// * This is the most basic way (that I could think of) to store state in a contiguous buffer.
// It is tightly coupled with application logic, inflexible, yet efficient.

const SimpleModel = (() => {

    const buffer = new ArrayBuffer(20000);

    const DISPLAY_WIDTH = 256;
    const DISPLAY_HEIGHT = 256;
    const DISPLAY_PIXEL_COUNT = DISPLAY_WIDTH * DISPLAY_HEIGHT;
    const DISPLAY_PIXELS = new Uint32Array(DISPLAY_PIXEL_COUNT);

    let particlePool;

    // Initialize
    (() => {
        const cursor = Buffer.createCursor(buffer, 0);
        particlePool = Particle.createPool(cursor, 100);
        Particle.add(particlePool, 200, 200, 1, 2, 0xffff9090);
        Particle.add(particlePool, 100, 200, 4, 5, 0xffff00ff);
    })();

    function render(positions, colors, length) {
        for (let index1 = 0, index2 = 0; index1 < length; index1++, index2 += 2) {
            Raster.fillAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, positions[index2], positions[index2 + 1], 2, 2, colors[index1]);
        }
    }

    return {

        getDisplayHeight: () => DISPLAY_HEIGHT,
        getDisplayWidth: () => DISPLAY_WIDTH,
        getDisplayPixelCount: () => DISPLAY_PIXEL_COUNT,
        getDisplayPixels: () => DISPLAY_PIXELS,

        render() {
            Raster.fillAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, 0, 0, 100, 100, 0xff0ff0ff);
            render(particlePool.positions, particlePool.colors, particlePool.count[0]);
        }
    };

})();