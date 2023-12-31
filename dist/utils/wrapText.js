"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    for (var n = 0; n < words.length; n++) {
        testLine += words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            y += lineHeight;
            line = words[n] + " ";
            testLine = words[n] + " ";
        }
        else {
            line += words[n] + " ";
        }
        if (n === words.length - 1) {
            ctx.fillText(line, x, y);
        }
    }
}
exports.default = wrapText;
