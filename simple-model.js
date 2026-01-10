///////////////////////
// ABOUT SimpleModel //
///////////////////////
// * This is the most basic way (that I could think of) to store state in a contiguous buffer.
// It is tightly coupled with application logic, inflexible, yet efficient.

const SimpleModel = (() => {

    const buffer = new ArrayBuffer(80000);

    const DISPLAY_WIDTH = 256;
    const DISPLAY_HEIGHT = 256;
    const DISPLAY_PIXEL_COUNT = DISPLAY_WIDTH * DISPLAY_HEIGHT;
    const DISPLAY_PIXELS = new Uint32Array(DISPLAY_PIXEL_COUNT);

    let particlePool;

    function render(positions, colors, length) {
        for (let index1 = 0, index2 = 0; index1 < length; index1++, index2 += 2) {
            Raster.fillAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, positions[index2], positions[index2 + 1], 1, 1, colors[index1]);
        }
    }

    // A deterministic, stateless random function. Pass in the seed and index to get the same "random" value every time.
    // Generate the seed from system time at startup. Reuse it and track index for stateful random results or recalculate it for stateless results.
    function random01(seed, index) {
        let x = seed ^ index;
        x ^= x >>> 16;
        x = PureMath.integer32Multiply(x, 0x7feb352d);
        x ^= x >>> 15;
        x = PureMath.integer32Multiply(x, 0x846ca68b);
        x ^= x >>> 16;
        return (x >>> 0) * PureMath.inverseUInt32;
    }

    return {
        getDisplayHeight: () => DISPLAY_HEIGHT,
        getDisplayWidth: () => DISPLAY_WIDTH,
        getDisplayPixelCount: () => DISPLAY_PIXEL_COUNT,
        getDisplayPixels: () => DISPLAY_PIXELS,

        initialize(randomSeed) {
            let randomIndex = 0;

            const cursor = Buffer.createCursor(buffer, 0);
            particlePool = Particle.createPool(cursor, 2000);
            for (var i = 0; i < 2000; i++) {
                Particle.add(particlePool, PureMath.floor(random01(randomSeed, randomIndex++) * DISPLAY_WIDTH), PureMath.floor(random01(randomSeed, randomIndex++) * DISPLAY_HEIGHT), random01(randomSeed, randomIndex++) - 0.5, random01(randomSeed, randomIndex++) - 0.5, 0xffff9090);

            }
        },

        render() {
            Raster.fillTransparentAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 0x01000000);
            render(particlePool.positions, particlePool.colors, particlePool.count[0]);

            return true;
        },

        update(platformTimeStamp) {
            Particle.move(particlePool);
            Particle.collideInnerRectangle(particlePool, 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
            return true;
        }
    };

})();