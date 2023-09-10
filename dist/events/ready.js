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
const discord_js_1 = __importDefault(require("discord.js"));
const Event_1 = __importDefault(require("../classes/Event"));
const fetchPlanning_1 = require("../utils/fetchPlanning");
const roles_1 = __importDefault(require("../roles"));
const types_1 = require("../types");
const User_1 = __importDefault(require("../models/User"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const rolePlannings = {};
function detectPlanningChanges(oldPlan, newPlan) {
    const changes = [];
    for (const oldItem of oldPlan) {
        if (!newPlan.some((newItem) => isEqual(oldItem, newItem))) {
            changes.push({ type: types_1.ChangeType.Removed, item: oldItem });
        }
    }
    for (const newItem of newPlan) {
        if (!oldPlan.some((oldItem) => isEqual(newItem, oldItem))) {
            changes.push({ type: types_1.ChangeType.Added, item: newItem });
        }
    }
    return changes;
}
function isEqual(item1, item2) {
    return (`${item1.day}:${item1.time.startHours}:${item1.time.startMin}` ===
        `${item2.day}:${item2.time.startHours}:${item2.time.startMin}` &&
        `${item1.day}:${item1.time.endHours}:${item1.time.endMin}` ===
            `${item2.day}:${item2.time.endHours}:${item2.time.endMin}` &&
        item1.title === item2.title &&
        item1.room === item2.room);
}
exports.default = new Event_1.default(discord_js_1.default.Events.ClientReady, (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(`Logged as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.displayName}`);
    yield ((_c = (_b = client.application) === null || _b === void 0 ? void 0 : _b.commands) === null || _c === void 0 ? void 0 : _c.set(client.commands.map((command) => command.data)));
    function polling() {
        Object.entries(roles_1.default).forEach(([roleId, role]) => __awaiter(this, void 0, void 0, function* () {
            if (role.campus === types_1.Campus.Sen) {
                var { planning } = yield (0, fetchPlanning_1.fetchPlanningSenart)(-1, role.id);
            }
            else {
                var { planning } = yield (0, fetchPlanning_1.fetchPlanningFontainebleau)(-1, role.id, role.grp);
            }
            if (Object.keys(rolePlannings).length < Object.keys(roles_1.default).length) {
                return (rolePlannings[roleId] = planning);
            }
            const changes = detectPlanningChanges(rolePlannings[roleId], planning);
            rolePlannings[roleId] = [...planning];
            if (changes.length > 0) {
                const removed = changes.filter((change) => change.type === types_1.ChangeType.Removed);
                const added = changes.filter((change) => change.type === types_1.ChangeType.Added);
                const discordUsers = yield User_1.default.find({
                    promoRoleId: roleId,
                    notifyByDiscord: true,
                });
                const emailUsers = yield User_1.default.find({
                    promoRoleId: roleId,
                    notifyByEmail: true,
                });
                if (emailUsers.length > 0) {
                    (0, sendMail_1.default)(emailUsers.filter((u) => u.email).map((u) => u.email), {
                        subject: "Nouveaux changements d'emploi du temps",
                        html: "<h1>Nouveaux changements d'emploi du temps</h1>" +
                            (removed.length > 0
                                ? "<h2>Cours supprimés</h2><div>" +
                                    removed
                                        .map((change) => `<li>${change.item.title} - Salle: ${change.item.room} - ${change.item.date}</li>`)
                                        .join("") +
                                    "</div>"
                                : "") +
                            (added.length > 0
                                ? "<h2>Cours ajoutés</h2><div>" +
                                    added
                                        .map((change) => `<li>${change.item.title} - Salle: ${change.item.room} - ${change.item.date}</li>`)
                                        .join("") +
                                    "</div>"
                                : "") +
                            `<div><p>Si vous avez des doutes quant à vôtre emploi du temps, merci de consulter <a href="${role.url}">ce site</a>.</p><p>Le code souce github est valable sur <a href="https://github.com/du-cassoulet/planning-bot">ce lien</a>.</p><div>`,
                    });
                }
                for (const userData of discordUsers) {
                    const user = yield client.users.fetch(userData.discordId, {
                        cache: true,
                    });
                    yield user.send({
                        content: "# <:online:1109406525170130944> Nouveaux changements d'emploi du temps" +
                            (removed.length > 0
                                ? "\n## <:eventminus:1150164950921269299> Cours supprimés\n" +
                                    removed
                                        .map((change) => `- ${change.item.title} - Salle: ${change.item.room} - ${change.item.date}`)
                                        .join("\n") +
                                    "\n"
                                : "") +
                            (added.length > 0
                                ? "\n## <:eventplus:1150164948606005259> Cours ajoutés\n" +
                                    added
                                        .map((change) => `- ${change.item.title} - Salle: ${change.item.room} - ${change.item.date}`)
                                        .join("\n") +
                                    "\n"
                                : "") +
                            `Si vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${role.url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).`,
                    });
                }
            }
        }));
        return setTimeout(polling, 300000);
    }
    polling();
    return console.log(`${client.commands.size} commands published.`);
}));
