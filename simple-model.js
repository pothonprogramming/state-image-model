///////////////////////
// ABOUT SimpleModel //
///////////////////////
// * This is the most basic way to store state in a buffer.
// It is tightly coupled with application logic, inflexible, and efficient.

const SimpleModel = (() => {

    // This map helps give logical names to metadata indices.
    // Metadata entries will be accessed directly by index using this map.
    // Could use an enum in C
    const map = {
        header: 0,
        particleLifetimes: 1,
        particlePositions: 2
    };

    const buffer = new ArrayBuffer(1024);
    const f32View = new Float32Array(buffer);
    const u8View = new Uint8Array(buffer);
    const u32View = new Uint32Array(buffer);

    // The header itself is a metadata entry that describes the metadata segment
    // It should consume the same number of elements as any metadata entry.
    // This simplifies the indexing arithmetic.
    u32View[0] = 3; // metadata offset or metadata entry length
    u32View[1] = 3; // number of metadata entries including the header entry
    // u32View[2] = 0; // unused

    setEntry(u32View, map.particleLifetimes, 1, 10, 0);
    setEntry(u32View, map.particlePositions, 4, 10, 0);
    calculateDataOffsets(u32View);

    // * Each metadata entry has 3 properties:
    // dataOffset - The offset of the data in typed units
    // dataLength - The length of the data in logical elements
    // dataCount  - The number of elements in use
    // * Note: dataOffset cannot be set until all dataLengths are known.
    // dataTypeSize is set temporarily to track the size of each data element in bytes.
    // dataTypeSize will be used to calculate the data offset.
    function setEntry(u32View, entryIndex, dataTypeSize, dataLength, dataCount) {
        const entriesLength = u32View[1]; // The number of entries allowed in the buffer.
        if (entryIndex >= entriesLength) return; // Do not allow writing to indices that are out of range.
        const entryLength = u32View[0]; // The length of any entry or the number of elements per entry.
        let writeOffset = entryIndex * entryLength; // The write offset of the entry.
        u32View[writeOffset] = dataTypeSize;
        u32View[writeOffset + 1] = dataLength;
        u32View[writeOffset + 2] = dataCount;
    }

    function calculateDataOffsets(u32View) {
        const entryLength = u32View[0]; // The number of elements per entry.
        const entriesLength = u32View[1]; // The number of entries to process.
        let entryIndex = 1; // The first non-header entry
        let dataByteOffset = entryLength * entriesLength * 4; // The first possible data offset in bytes
        while (entryIndex < entriesLength) {
            const entryOffset = entryIndex * entryLength;
            const dataTypeSize = u32View[entryOffset];
            const dataLength = u32View[entryOffset + 1];
            const dataOffset = Math.ceil(dataByteOffset / dataTypeSize);
            u32View[entryOffset] = dataOffset;
            dataByteOffset = (dataOffset + dataLength) * dataTypeSize;
            entryIndex++;
        }
    }

    function getDataOffset(u32View, entryIndex) {
        const entryLength = u32View[0];
        return u32View[entryIndex * entryLength];
    }

    function getDataLength(u32View, entryIndex) {
        const entryLength = u32View[0];
        return u32View[entryIndex * entryLength + 1];
    }

    function populateParticles(map, u32View, u8View, f32View, count) {
        const entryLength = u32View[0];
        const particleLifetimesMetaOffset = map.particleLifetimes * entryLength;
        const particlePositionsMetaOffset = map.particlePositions * entryLength;
        const particleLifetimesDataOffset = u32View[particleLifetimesMetaOffset];
        const particlePositionsDataOffset = u32View[particlePositionsMetaOffset];

        for (let index = 0; index < count; index++) {
            f32View[particlePositionsDataOffset + index] = Number(Math.random() * 10).toFixed(2);
            u8View[particleLifetimesDataOffset + index] = Math.floor(Math.random() * 255);
            u32View[particleLifetimesMetaOffset + 2] ++;
            u32View[particlePositionsMetaOffset + 2] ++;
        }
    }

    populateParticles(map, u32View, u8View, f32View, 10);

    console.log(u32View.slice(0, u32View[0] * u32View[1]));
    const particleLifetimesOffset = map.particleLifetimes * u32View[0];
    console.log(u8View.slice(u32View[particleLifetimesOffset], u32View[particleLifetimesOffset] + u32View[particleLifetimesOffset + 1]));
    console.log(f32View.slice(getDataOffset(u32View, map.particlePositions), getDataOffset(u32View, map.particlePositions) + getDataLength(u32View, map.particlePositions)));

})();