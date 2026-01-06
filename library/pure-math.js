// Some basic Math methods

const PureMath = {
    ceiling(value) {
        const integer = value | 0;
        return value > integer ? integer + 1 : integer;
    },
    floor(value) {
        const integer = value | 0;
        return value < integer ? integer - 1 : integer;
    }
};