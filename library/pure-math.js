// Some basic Math methods

const PureMath = {
    inverseUInt32:0.00000000023283064365386963, // 1 / 4294967296

    ceiling(value) {
        const integer = value | 0;
        return value > integer ? integer + 1 : integer;
    },
    floor(value) {
        const integer = value | 0;
        return value < integer ? integer - 1 : integer;
    },
    integer32Multiply(a, b) {
        const aHigh = (a >>> 16) & 0xffff;
        const aLow = a & 0xffff;
        const bHigh = (b >>> 16) & 0xffff;
        const bLow = b & 0xffff;
        return (aLow * bLow + (((aHigh * bLow + aLow * bHigh) & 0xffff) << 16)) | 0;
    }
};