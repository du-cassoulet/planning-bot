"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function colorByTitle(title) {
    const colorWidth = 360 / constants_1.COLOR_NUMBER;
    let val = 0;
    for (let i = 0; i < title.length; i++) {
        val += title.charCodeAt(i);
    }
    return [
        `hsl(${(val % constants_1.COLOR_NUMBER) * colorWidth}, 70%, 80%)`,
        `hsl(${(val % constants_1.COLOR_NUMBER) * colorWidth}, 70%, 60%)`,
    ];
}
exports.default = colorByTitle;
