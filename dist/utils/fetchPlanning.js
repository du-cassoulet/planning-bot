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
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const puppeteer_1 = require("puppeteer");
const he_1 = __importDefault(require("he"));
const dev = process.argv.includes("--dev");
function fetchPlanningSenart(nextWeek) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield (0, puppeteer_1.launch)({
            headless: dev ? false : "new",
        });
        const page = yield browser.newPage();
        yield page.goto("https://dynasis.iutsf.org/index.php?group_id=6&id=14");
        const weekButton = yield page.waitForSelector(constants_1.Senart.WEEK_BUTTON);
        yield (weekButton === null || weekButton === void 0 ? void 0 : weekButton.click());
        for (let i = 0; i < nextWeek; i++) {
            const nextWeekButton = yield page.waitForSelector(constants_1.Senart.NEXT_BUTTON);
            yield (nextWeekButton === null || nextWeekButton === void 0 ? void 0 : nextWeekButton.click());
        }
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
        return {
            planning: classes,
            url: "https://dynasis.iutsf.org/index.php?group_id=6&id=14",
        };
    });
}
exports.fetchPlanningSenart = fetchPlanningSenart;
function fetchPlanningFontainebleau(nextWeek, id, group) {
    return __awaiter(this, void 0, void 0, function* () {
        const startOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
            .startOf("week")
            .toDate();
        const endOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
            .endOf("week")
            .toDate();
        const formatedStart = startOfWeek.toJSON().slice(0, -5);
        const formatedEnd = endOfWeek.toJSON().slice(0, -5);
        const { data } = yield axios_1.default.get(`http://www.iut-fbleau.fr/EDT/consulter/ajax/ep.php?p=${id}&start=${encodeURIComponent(formatedStart)}&end=${encodeURIComponent(formatedEnd)}`);
        const rawClasses = data
            .filter((d) => d.numero === group.toString())
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        const classes = rawClasses.map((c) => {
            const start = new Date(c.start);
            const end = new Date(c.end);
            return {
                day: start.getDay(),
                time: {
                    startHours: start.getHours(),
                    startMin: start.getMinutes(),
                    endHours: end.getHours(),
                    endMin: end.getMinutes(),
                },
                title: c.title,
                room: c.salle,
                details: c.nomADE + ` (Grp.${c.numero})`,
            };
        });
        return { planning: classes, url: "http://www.iut-fbleau.fr/EDT/consulter" };
    });
}
exports.fetchPlanningFontainebleau = fetchPlanningFontainebleau;
