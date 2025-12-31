///////////////////////
// ABOUT SimpleModel //
///////////////////////
// * This is the most basic way (that I could think of) to store state in a contiguous buffer.
// It is tightly coupled with application logic, inflexible, yet efficient.

const SimpleModel = (() => {

    const PARTICLES_LENGTH = 100;
    const POSITION_STRIDE = 2;
    const VECTOR_STRIDE = 2;

    const buffer = new ArrayBuffer(20000);
    const cursor = Buffer.createCursor(buffer, 0);

    const particles = {
        positions: Buffer.createFloat32View(cursor, PARTICLES_LENGTH * POSITION_STRIDE),
        vectors: Buffer.createFloat32View(cursor, PARTICLES_LENGTH * VECTOR_STRIDE),
        colors: Buffer.createFloat32View(cursor, PARTICLES_LENGTH)
    };

    return {
        run() {
            particles.positions[0] = 10.1;
            console.log(particles.positions);
        }
    };

})();