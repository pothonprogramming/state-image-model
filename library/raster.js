// Handy Rasterization methods:

const Raster = {
    fillAxisAlignedRectangle(raster_pixels, raster_width, rectangle_left, rectangle_top, rectangle_width, rectangle_height, color) {
        const bottom = PureMath.ceiling(rectangle_top + rectangle_height); // Expand edges to draw all pixels that overlap the rectangle
        const left = PureMath.floor(rectangle_left);
        const right = PureMath.ceiling(rectangle_left + rectangle_width);
        const top = PureMath.floor(rectangle_top);

        let index = top * raster_width + left;
        const indexYStep = raster_width - right + left;

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                raster_pixels[index] = color;
                index++;
            }
            index += indexYStep;
        }
    },
};