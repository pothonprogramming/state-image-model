// Handy Rasterization methods:
// Color values are expected to be stored as AABBGGRR.

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
    
    fillTransparentAxisAlignedRectangle(raster_pixels, raster_width, rectangle_left, rectangle_top, rectangle_width, rectangle_height, color) {
        const bottom = PureMath.ceiling(rectangle_top + rectangle_height); // Expand edges to draw all pixels that overlap the rectangle
        const left = PureMath.floor(rectangle_left);
        const right = PureMath.ceiling(rectangle_left + rectangle_width);
        const top = PureMath.floor(rectangle_top);

        let index = top * raster_width + left;
        const indexYStep = raster_width - right + left;

        const alpha = color >>> 24;
        const inverseAlpha = 255 - alpha;

        const colorBR = color & 0x00ff00ff;
        const colorAG = (color >>> 8) & 0x00ff00ff;

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                const baseColor = raster_pixels[index];

                const baseColorBR = baseColor & 0x00ff00ff;
                const baseColorAG = (baseColor >> 8) & 0x00ff00ff;

                const br = (colorBR * alpha + baseColorBR * inverseAlpha) >>> 8;
                const ag = (colorAG * alpha + baseColorAG * inverseAlpha) >>> 8;

                raster_pixels[index] = ((ag << 8) & 0xff00ff00) | (br & 0x00ff00ff);

                index++;
            }
            index += indexYStep;
        }
    }
};