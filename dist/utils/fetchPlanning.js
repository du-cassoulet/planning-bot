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
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
function fetchPlanningSenart(nextWeek, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`https://dynasis.iutsf.org/index.php?group_id=6&id=${id}`);
        const jsonData = `{${data.split("$('#calendar').fullCalendar({")[1].split("});")[0]}}`
            .replace(/\/\/.*/g, "")
            .replace(/"/g, '\\"')
            .replace(/'/g, '"')
            .replace(/(\w+):\s/g, '"$1": ');
        const { events } = JSON.parse(jsonData);
        if (nextWeek < 0) {
            var startOfWeek = (0, moment_1.default)().startOf("week");
            var endOfWeek = (0, moment_1.default)().startOf("week").add(6, "month");
        }
        else {
            var startOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek).startOf("week");
            var endOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek).endOf("week");
        }
        const rawClasses = events.filter((event) => (0, moment_1.default)(event.start).isBetween(startOfWeek, endOfWeek));
        const classes = rawClasses.map((c) => {
            const start = new Date(c.start);
            const end = new Date(c.end);
            const lines = c.title.split("\r\n");
            const title = lines[0].replace(/\s+/g, " ").trim();
            const room = lines[1].replace(/\s+/g, " ").trim();
            const details = lines[2].replace(/\s+/g, " ").trim();
            return {
                day: start.getDay(),
                date: (0, moment_1.default)(start).format("Do MMMM"),
                time: {
                    startHours: start.getHours(),
                    startMin: start.getMinutes(),
                    endHours: end.getHours(),
                    endMin: end.getMinutes(),
                },
                title,
                room,
                details,
            };
        });
        return {
            planning: classes,
            url: "https://dynasis.iutsf.org/index.php?group_id=6&id=14",
        };
    });
}
exports.fetchPlanningSenart = fetchPlanningSenart;
function fetchPlanningFontainebleau(nextWeek, id, group) {
    return __awaiter(this, void 0, void 0, function* () {
        if (nextWeek < 0) {
            var startOfWeek = (0, moment_1.default)().startOf("week").toDate();
            var endOfWeek = (0, moment_1.default)().startOf("week").add(6, "month").toDate();
        }
        else {
            var startOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .startOf("week")
                .toDate();
            var endOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .endOf("week")
                .toDate();
        }
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
                date: (0, moment_1.default)(start).format("Do MMMM"),
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
