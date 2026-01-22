//////////////
// PARTICLE //
//////////////
// A utility for managing Particles and Particle pools

const Particle = {
    // Creates a "pool" of particle components, which are just preallocated arrays and some data to interpret boundaries.
    createPool: (cursor, limit) => {
        const particles = {
            count: Buffer.createU32View(cursor, 1), // Active particle count
            limit: Buffer.createU32View(cursor, 1), // Maximum number of particles
            positions: Buffer.createF32View(cursor, limit * 2),
            vectors: Buffer.createF32View(cursor, limit * 2),
            colors: Buffer.createU32View(cursor, limit)
        }
        particles.count[0] = 0;
        particles.limit[0] = limit;

        return particles;
    },
    add: (pool, position_x, position_y, vector_x, vector_y, color) => {
        const index = pool.count[0];
        const index2 = index * 2;

        Buffer.setF32_2(pool.positions, index2, position_x, position_y);
        Buffer.setF32_2(pool.vectors, index2, vector_x, vector_y);
        Buffer.setU32(pool.colors, index, color);

        pool.count[0]++;
    },
    remove: (pool, index) => {
        const index2 = index * 2;
        const lastIndex = pool.count[0] - 1;
        const lastIndex2 = lastIndex * 2;

        Buffer.setF32_2(pool.positions, index2, pool.positions[lastIndex2], pool.positions[lastIndex2 + 1]);
        Buffer.setF32_2(pool.vectors, index2, pool.vectors[lastIndex2], pool.vectors[lastIndex2 + 1]);
        Buffer.setF32(pool.colors, index, pool.colors[lastIndex]);

        pool.count[0]--;
    },
    collideInnerRectangle(pool, rectangle_left, rectangle_top, rectangle_right, rectangle_bottom) {
        const length2 = pool.count[0] * 2;
        const positions = pool.positions;
        const vectors = pool.vectors;
        for (let xIndex = 0; xIndex < length2; xIndex += 2) {
            const yIndex = xIndex + 1;
            if (positions[xIndex] < rectangle_left) {
                positions[xIndex] = rectangle_left;
                vectors[xIndex] *= -1;
            } else if (positions[xIndex] >= rectangle_right) {
                positions[xIndex] = rectangle_right - 1;
                vectors[xIndex] *= -1;
            }
            if (positions[yIndex] < rectangle_top) {
                positions[yIndex] = rectangle_top;
                vectors[yIndex] *= -1;
            } else if (positions[yIndex] >= rectangle_bottom) {
                positions[yIndex] = rectangle_bottom - 1;
                vectors[yIndex] *= -1;
            }
        }
    },
    force(pool, x, y) {
        const length2 = pool.count[0] * 2;
        const positions = pool.positions;
        const vectors = pool.vectors;
        for (let xIndex = 0; xIndex < length2; xIndex += 2) {
            const yIndex = xIndex + 1;
            const distanceX = positions[xIndex] - x;
            const distanceY = positions[yIndex] - y;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            const forceX = (distanceX * 0.25)/distanceSquared;
            const forceY = (distanceY * 0.25)/distanceSquared;
            vectors[xIndex] += forceX;
            vectors[yIndex] += forceY
        }
    },
    move(pool, gravity, friction) {
        const length2 = pool.count[0] * 2;
        const positions = pool.positions;
        const vectors = pool.vectors;
        for (let xIndex = 0; xIndex < length2; xIndex += 2) {
            const yIndex = xIndex + 1;
            positions[xIndex] += vectors[xIndex];
            positions[yIndex] += vectors[yIndex];
            vectors[xIndex] *= friction;
            vectors[yIndex] *= friction;
            vectors[yIndex] += gravity;
        }
    },
};