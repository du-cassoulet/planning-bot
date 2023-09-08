"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const canvas_1 = __importDefault(require("canvas"));
const wrapText_1 = __importDefault(require("./wrapText"));
const colorByTitle_1 = __importDefault(require("./colorByTitle"));
const Days = Object.freeze([
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
]);
function makeCanvas(planning) {
    const canvas = canvas_1.default.createCanvas(constants_1.DAY_WIDTH * constants_1.DAYS + constants_1.TIME_LABEL_SPACE, constants_1.TIME_HEIGHT * constants_1.HOURS + constants_1.DAY_LABEL_SPACE);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1b1d21";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2a2c30";
    ctx.fillRect(constants_1.TIME_LABEL_SPACE, constants_1.DAY_LABEL_SPACE, canvas.width - constants_1.TIME_LABEL_SPACE, canvas.height - constants_1.DAY_LABEL_SPACE);
    ctx.strokeStyle = "#aaaaaa";
    for (let i = 1; i < constants_1.DAYS - 1; i++) {
        ctx.strokeRect(constants_1.TIME_LABEL_SPACE + i * constants_1.DAY_WIDTH, -10, constants_1.DAY_WIDTH, constants_1.DAY_LABEL_SPACE + 10);
    }
    ctx.fillStyle = "#eeeeee";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "30px Arial";
    for (let i = 0; i < constants_1.DAYS; i++) {
        ctx.fillText(Days[i], constants_1.TIME_LABEL_SPACE + i * constants_1.DAY_WIDTH + constants_1.DAY_WIDTH / 2, constants_1.DAY_LABEL_SPACE / 2);
    }
    for (let i = 0; i < constants_1.HOURS; i++) {
        ctx.fillText(`${constants_1.START_HOUR + i}:00 -`, constants_1.TIME_LABEL_SPACE / 2, constants_1.DAY_LABEL_SPACE + i * constants_1.TIME_HEIGHT);
    }
    ctx.strokeStyle = "#666666";
    for (let i = 0; i < constants_1.DAYS; i++) {
        for (let j = 0; j < constants_1.HOURS; j++) {
            ctx.strokeRect(constants_1.TIME_LABEL_SPACE + i * constants_1.DAY_WIDTH, constants_1.DAY_LABEL_SPACE + j * constants_1.TIME_HEIGHT, constants_1.DAY_WIDTH, constants_1.TIME_HEIGHT);
        }
    }
    ctx.strokeStyle = "#aaaaaa";
    ctx.strokeRect(constants_1.TIME_LABEL_SPACE, constants_1.DAY_LABEL_SPACE, canvas.width, canvas.height);
    planning.forEach((classData) => {
        const [clear, dark] = (0, colorByTitle_1.default)(classData.title.split(/\./).slice(0, -1).join("."));
        const left = constants_1.TIME_LABEL_SPACE + (classData.day - 1) * constants_1.DAY_WIDTH + 1;
        const width = constants_1.DAY_WIDTH - 2;
        const top = constants_1.DAY_LABEL_SPACE +
            (classData.time.startHours - constants_1.START_HOUR + classData.time.startMin / 60) *
                constants_1.TIME_HEIGHT +
            1;
        const height = (classData.time.endHours +
            classData.time.endMin / 60 -
            (classData.time.startHours + classData.time.startMin / 60)) *
            constants_1.TIME_HEIGHT -
            2;
        ctx.fillStyle = clear;
        ctx.strokeStyle = dark;
        ctx.beginPath();
        ctx.roundRect(left, top, width, height, 20);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#1b1d21";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = "30px Arial";
        (0, wrapText_1.default)(ctx, classData.title + " - " + classData.room, left + 20, top + 50, width - 40, 35);
        ctx.font = "15px Arial";
        (0, wrapText_1.default)(ctx, classData.details, left + 20, top + height - 40, width - 40, 20);
    });
    return canvas;
}
exports.default = makeCanvas;
