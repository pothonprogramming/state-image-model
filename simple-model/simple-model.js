///////////////////////
// ABOUT SimpleModel //
///////////////////////
// * This is the most basic way (that I could think of) to store state in a contiguous buffer.
// It is tightly coupled with application logic, inflexible, yet efficient.

const SimpleModel = (() => {

    ///////////////
    // Variables //
    ///////////////

    const buffer = new ArrayBuffer(120000);

    const DISPLAY_WIDTH = 256;
    const DISPLAY_HEIGHT = 256;
    const DISPLAY_PIXEL_COUNT = DISPLAY_WIDTH * DISPLAY_HEIGHT;
    const DISPLAY_PIXELS = new Uint32Array(DISPLAY_PIXEL_COUNT);

    const mouse = Mouse.create(0, 0);

    let randomSeed = 0;
    let randomIndex = 0;
    const gravity = 0.005;
    const friction = 0.999;

    let circleColor = 0x000000;
    let circleRadiusSquared = 5 * 5;
    let circleX = PureMath.floor(DISPLAY_WIDTH * 0.5);
    let circleY = PureMath.floor(DISPLAY_HEIGHT * 0.75);

    let particlePool;
    console.log(PureMath.approximateSquareRoot(16));

    ////////////////////////
    // Internal Functions //
    ////////////////////////

    function consume(positions, colors, length) {
        circleColor = 0x000000;
        const length2 = length * 2;
        for (let index2 = 0; index2 < length2; index2 += 2) {
            const distanceX = circleX - positions[index2];
            const distanceY = circleY - positions[index2 + 1];
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            if (distanceSquared < circleRadiusSquared) {
                //console.log(circleRadiusSquared);
                const index1 = index2 * 0.5;
                circleColor = colors[index1];
                circleRadiusSquared += 1 / PureMath.Pi;
                Particle.remove(particlePool, index1);
            }
        }
    }

    function render(positions, colors, length) {
        for (let index1 = 0, index2 = 0; index1 < length; index1++, index2 += 2) {
            Raster.fillAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, PureMath.floor(positions[index2]), PureMath.floor(positions[index2 + 1]), 1, 1, colors[index1]);
        }
    }

    // A deterministic, stateless random function. Pass in the seed and index to get the same "random" value every time.
    // Generate the seed from system time at startup. Reuse it and track index for stateful random results or recalculate it for stateless results.
    function randomU32(seed, index) {
        let x = seed ^ index;
        x ^= x >>> 16;
        x = PureMath.integer32Multiply(x, 0x7feb352d);
        x ^= x >>> 15;
        x = PureMath.integer32Multiply(x, 0x846ca68b);
        x ^= x >>> 16;
        return x >>> 0;
    }

    function randomRangeU32(seed, index, lowValue, highValue) {
        const range = (highValue - lowValue + 1) >>> 0;
        return lowValue + ((randomU32(seed, index) * range) * PureMath.inverseU32 | 0);
    }

    function randomRangeF32(seed, index, lowValue, highValue) {
        return lowValue + randomU32(seed, index) * PureMath.inverseU32 * (highValue - lowValue);
    }

    function randomColor(seed, index, lowBlue, highBlue, lowGreen, highGreen, lowRed, highRed) {
        const b = randomRangeU32(seed, index, lowBlue, highBlue) & 0xff;
        const g = randomRangeU32(seed, index + 1, lowGreen, highGreen) & 0xff;
        const r = randomRangeU32(seed, index + 2, lowRed, highRed) & 0xff;

        return (0xff << 24) | (b << 16) | (g << 8) | r;
    }

    /////////////////////
    // Exposed Methods //
    /////////////////////

    return {
        getDisplayHeight: () => DISPLAY_HEIGHT,
        getDisplayWidth: () => DISPLAY_WIDTH,
        getDisplayPixelCount: () => DISPLAY_PIXEL_COUNT,
        getDisplayPixels: () => DISPLAY_PIXELS,

        initialize(seed) {
            randomSeed = seed;
            const cursor = Buffer.createCursor(buffer, 0);
            particlePool = Particle.createPool(cursor, 4000);
            for (var i = 0; i < 4000; i++) {
                const px = randomRangeU32(randomSeed, randomIndex++, 0, DISPLAY_WIDTH);
                const py = randomRangeU32(randomSeed, randomIndex++, 0, DISPLAY_HEIGHT);
                const vx = randomRangeF32(randomSeed, randomIndex++, 0, 1) - 0.5;
                const vy = randomRangeF32(randomSeed, randomIndex++, 0, 1) - 0.5;
                const color = randomColor(randomSeed, randomIndex++, 128, 192, 128, 192, 128, 192);
                Particle.add(particlePool, px, py, vx, vy, color);
            }
        },

        render() {
            if (circleColor) {
                const circleRadius = PureMath.approximateSquareRoot(circleRadiusSquared);
                // Testing to see how far off the approximate version is. It's not too bad!
                //console.log("diff: " + (circleRadius - Math.sqrt(circleRadiusSquared)));
                Raster.fillCircle(DISPLAY_PIXELS, DISPLAY_WIDTH, circleX, circleY, circleRadius, circleColor);
            }
            Raster.fillTransparentAxisAlignedRectangle(DISPLAY_PIXELS, DISPLAY_WIDTH, 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, (randomColor(randomSeed, randomIndex++) >> 8) & 0x00ffffff);
            render(particlePool.positions, particlePool.colors, particlePool.count[0]);

            return true;
        },

        update(platformTimeStamp) {
            Particle.force(particlePool, mouse.x, mouse.y);
            Particle.move(particlePool, gravity, friction);
            Particle.collideInnerRectangle(particlePool, 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
            consume(particlePool.positions, particlePool.colors, particlePool.count[0]);
            return true;
        },

        // Mouse Input

        setMousePosition(x, y) {
            Mouse.setPosition(mouse, x, y);
        },
        setMouseLeft(isDown) {
            Mouse.setLeft(mouse, isDown);
        },
        setMouseRight(isDown) {
            Mouse.setRight(mouse, isDown);
        }

    };

})();