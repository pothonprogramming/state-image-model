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
        particlePositions:0,
        particleLifetimes:1
    };

    const buffer = new ArrayBuffer(1024);
    const f32View = new Float32Array(buffer);
    const u8View = new Uint8Array(buffer);
    const u32View = new Uint32Array(buffer);

    // The header only tracks the number of metadata entries and it only takes up one uint32 slot.
    u32View[0] = 2;

    function getEntryOffset(entryIndex) {
        const headerLength = 1;
        const entryLength = 3;
        return headerLength + entryIndex * entryLength;
    }

    // * Each metadata entry has 3 properties:
    // dataOffset - The offset of the data in typed units
    // dataLength - The length of the data in logical elements
    // dataCount  - The number of elements in use
    // * Note: dataOffset cannot be set until all dataLengths are known.
    // dataTypeSize is set temporarily to track the size of each data element in bytes.
    // dataTypeSize will be used to calculate the data offset.
    function setEntry(u32View, entryIndex, dataTypeSize, dataLength, dataCount) {
        const entriesLength = u32View[0]; // The number of entries allowed in the buffer.
        if (entryIndex >= entriesLength) return;
        const entryLength = 3; // The length of any entry or the number of elements per entry.
        const headerLength = 1; // The length of the header.
        let writeOffset = headerLength + entryIndex * entryLength; // The write offset of the entry.
        u32View[writeOffset ++] = dataTypeSize;
        u32View[writeOffset ++] = dataLength;
        u32View[writeOffset ++] = dataCount;
    }

    function calculateDataOffsets(u32View) {
        const entriesLength = u32View[0]; // The number of entries to process.
        const entryLength = 3; // The number of elements per entry.
        const headerLength = 1; // The length of the header.
        let entryIndex = 0;
        let dataByteOffset = (headerLength + entriesLength * entryLength) * 4; // The first possible data offset in bytes
        while(entryIndex < entriesLength) {
            const entryOffset = headerLength + entryIndex * entryLength;
            const dataTypeSize = u32View[entryOffset];
            const dataLength = u32View[entryOffset + 1];
            const dataOffset = Math.ceil(dataByteOffset / dataTypeSize);
            u32View[entryOffset] = dataOffset;
            dataByteOffset = dataOffset + dataLength * dataTypeSize;
            entryIndex ++;
        }
    }

    setEntry(u32View, map.particleLifetimes, 1, 10, 0);
    setEntry(u32View, map.particlePositions, 4, 10, 0);
    calculateDataOffsets(u32View);

    function populateParticles(map, u32View, u8View, f32View, count) {
        const lifetimeOffset = u32View[getEntryOffset(map.particleLifetimes)];
        const positionOffset = u32View[getEntryOffset(map.particlePositions)];

        
    }



    console.log(f32View[u32View[getEntryOffset(map.particleLifetimes)]]);

})();