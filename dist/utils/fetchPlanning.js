"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPlanningFontainebleau = exports.fetchPlanningSenart = void 0;
const constants_1 = require("../constants");
const puppeteer_1 = require("puppeteer");
const he_1 = __importDefault(require("he"));
const dev = process.argv.includes("--dev");
function fetchPlanningSenart() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield (0, puppeteer_1.launch)({
            headless: dev ? false : "new",
        });
        const page = yield browser.newPage();
        yield page.goto("https://dynasis.iutsf.org/index.php?group_id=6&id=14");
        const weekButton = yield page.waitForSelector(constants_1.Senart.WEEK_BUTTON);
        if (weekButton)
            yield weekButton.click();
        yield page.waitForSelector(constants_1.Senart.TABLE_CONTAINER);
        const rawClasses = yield page.evaluate(({ TABLE_CONTAINER, DAY_CONTENT, CLASS_TIME, CLASS_CONTENT }) => {
            var _a, _b;
            const classes = [];
            const table = document.querySelector(TABLE_CONTAINER);
            if (!table)
                return classes;
            for (let i = 1; i < table.children.length; i++) {
                const dayPath = TABLE_CONTAINER + ` td:nth-child(${i + 1}) ` + DAY_CONTENT;
                const dayElement = document.querySelector(dayPath);
                if (!dayElement)
                    break;
                for (let j = 0; j < dayElement.children.length; j++) {
                    const classPath = dayPath +
                        ` a.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end:nth-child(${j + 1}) `;
                    const timeElement = document.querySelector(classPath + CLASS_TIME);
                    const titleElement = document.querySelector(classPath + CLASS_CONTENT);
                    if (!timeElement || !titleElement)
                        break;
                    const timeString = timeElement.getAttribute("data-full");
                    const groups = (_a = timeString === null || timeString === void 0 ? void 0 : timeString.match(/(?<sh>\d{2}):(?<sm>\d{2})\s-\s(?<eh>\d{2}):(?<em>\d{2})/)) === null || _a === void 0 ? void 0 : _a.groups;
                    const startHours = Number(groups === null || groups === void 0 ? void 0 : groups.sh);
                    const startMin = Number(groups === null || groups === void 0 ? void 0 : groups.sm);
                    const endHours = Number(groups === null || groups === void 0 ? void 0 : groups.eh);
                    const endMin = Number(groups === null || groups === void 0 ? void 0 : groups.em);
                    classes.push({
                        time: {
                            startHours,
                            startMin,
                            endHours,
                            endMin,
                        },
                        day: i,
                        textHTML: (_b = titleElement.textContent) !== null && _b !== void 0 ? _b : "",
                    });
                }
            }
            return classes;
        }, constants_1.Senart);
        const classes = rawClasses.map((c) => {
            const [titleHTML, roomHTML, detailsHTML] = c.textHTML.split("\n");
            return {
                day: c.day,
                time: c.time,
                title: he_1.default.decode(titleHTML).trim(),
                room: he_1.default.decode(roomHTML).trim(),
                details: he_1.default.decode(detailsHTML).trim().replace(/\s+/g, " "),
            };
        });
        yield browser.close();
        return classes;
    });
}
exports.fetchPlanningSenart = fetchPlanningSenart;
function fetchPlanningFontainebleau() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield (0, puppeteer_1.launch)({
            headless: dev ? false : "new",
        });
        const page = yield browser.newPage();
        yield page.goto("http://www.iut-fbleau.fr/EDT/consulter/");
        const weekButton = yield page.waitForSelector(constants_1.Fontainebleau.WEEK_BUTTON);
        if (weekButton)
            yield weekButton.click();
    });
}
exports.fetchPlanningFontainebleau = fetchPlanningFontainebleau;
fetchPlanningFontainebleau();
