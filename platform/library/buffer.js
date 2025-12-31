//////////////////
// ABOUT BUFFER //
//////////////////
// A utility that helps with the creation of typed views into a byte buffer.
// It requires the creation of a "cursor" object that acts as an offset tracker when creating each typed view.
// Typed views will be automatically aligned and the cursor will be automatically moved to prepare for the next view creation.

const Buffer = {
    // Byte stride values for each primitive type:
    // It might be better to just hard code these, but at least there's no guessing what these are for.
    float32ByteStride:4,
    uint32ByteStride:4,

    // The cursor object stores a reference to the buffer and the byte offset in the buffer at which to start tracking.
    // Adding the buffer reference keeps each cursor object tied to a specific buffer, so there is no accidental mismatch if multiple buffers are being used.
    createCursor: (buffer, byteOffset) => ({ buffer, byteOffset }),

    // Helper methods to remove some of the tedious construction.
    // byteStrides for each type are hard coded

    createFloat32View: (cursor, length) => new Float32Array(cursor.buffer, Buffer.getAlignedMovedByteOffset(cursor, Buffer.float32ByteStride, length), length),
    createUInt32View: (cursor, length) => new Uint32Array(cursor.buffer, Buffer.getAlignedMovedByteOffset(cursor, Buffer.uint32ByteStride, length), length),

    // Returns the aligned byte offset value, moved to the next address that is aligned with the byteAlignment boundary if necessary.
    getAlignedByteOffset: (byteOffset, byteAlignment) => (byteOffset + byteAlignment - 1) & ~(byteAlignment - 1),
    // Returns the moved byte offset value without ensuring alignment.
    getMovedByteOffset: (byteOffset, byteStride, length) => byteOffset + byteStride * length,

    // A helper method for the helper methods.
    getAlignedMovedByteOffset: (cursor, byteStride, length) => {
        const alignedByteOffset = Buffer.getAlignedByteOffset(cursor.byteOffset, byteStride); // Get the aligned offset of the cursor.
        cursor.byteOffset = Buffer.getMovedByteOffset(alignedByteOffset, byteStride, length); // Move the cursor.
        return alignedByteOffset;
    }
};