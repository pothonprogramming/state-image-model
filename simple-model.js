////////////////////////
// ABOUNT SimpleModel //
////////////////////////
// * SimpleModel showcases how you might track a combination of singleton data entries as well as array entries and pools.
// Pools are preallocated arrays in which only a portion of the array is tracking useful data, while the rest is reserved for later use.

const SimpleModel = (() => {

    const buffer = new ArrayBuffer(1024);
    const u32View = new Uint32Array(buffer);

    // In this model, the header only tracks the number of metadata entries and it only takes up one uint32 slot.
    u32View[0] = 0;

    // In this model, all metadata entries have the same number of properties, so the same method can be used to store any entry.
    function addMetadataEntry(u32View, id, dataOffset, dataLength = 1, dataCount = 1) {
        const metadataEntryElements = 4; // each metadata entry has 4 elements
        const metadataEntryCount = u32View[0] ++; // add 1 to the entry count and get the value
        const metadataEntryIndex = metadataEntryCount * metadataEntryElements + 1; // get the index at which to start writing this entry

        u32View[metadataEntryIndex ++] = id;
        u32View[metadataEntryIndex ++] = dataOffset;
        u32View[metadataEntryIndex ++] = dataLength;
        u32View[metadataEntryIndex]    = dataCount;
    }

})();