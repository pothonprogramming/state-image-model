const Mouse = {

    create: (x, y) => ({ x, y, leftIsDown:0, rightIsDown:0 }),

    setPosition(mouse, x, y) {
        mouse.x = x;
        mouse.y = y;
    },

    setLeft(mouse, isDown) {
        mouse.leftIsDown = isDown;
    },

    setRight(mouse, isDown) {
        mouse.rightIsDown = isDown;
    }

};