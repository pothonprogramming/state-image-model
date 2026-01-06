//////////////
// PARTICLE //
//////////////
// A utility for managing Particles and Particle pools

const Particle = {
    createPool: (cursor, length) => {
        const particles = {
            count: Buffer.createU32View(cursor, 1),
            length: Buffer.createU32View(cursor, 1),
            positions: Buffer.createF32View(cursor, length * 2),
            vectors: Buffer.createF32View(cursor, length * 2),
            colors: Buffer.createU32View(cursor, length)
        }
        particles.count[0] = 0;
        particles.length[0] = length;
        
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
    }
};