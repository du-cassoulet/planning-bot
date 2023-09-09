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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const Command_1 = __importDefault(require("../classes/Command"));
const makeCanvas_1 = __importDefault(require("../utils/makeCanvas"));
const types_1 = require("../types");
const constants_1 = require("../constants");
const moment_1 = __importDefault(require("moment"));
const fetchPlanning_1 = require("../utils/fetchPlanning");
const roles = {
    [(_a = process.env.BUT1_SEN_ROLE_ID) !== null && _a !== void 0 ? _a : ""]: {
        type: types_1.Campus.Sen,
        grp: 1,
        id: 14,
        name: "BUT 1 Site Sénart",
    },
    [(_b = process.env.BUT1_FBL_GR1_ROLE_ID) !== null && _b !== void 0 ? _b : ""]: {
        type: types_1.Campus.Sen,
        grp: 1,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 1",
    },
    [(_c = process.env.BUT1_FBL_GR2_ROLE_ID) !== null && _c !== void 0 ? _c : ""]: {
        type: types_1.Campus.Sen,
        grp: 2,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 2",
    },
    [(_d = process.env.BUT1_FBL_GR3_ROLE_ID) !== null && _d !== void 0 ? _d : ""]: {
        type: types_1.Campus.Sen,
        grp: 3,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 3",
    },
    [(_e = process.env.BUT1_FBL_GR4_ROLE_ID) !== null && _e !== void 0 ? _e : ""]: {
        type: types_1.Campus.Sen,
        grp: 4,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 4",
    },
    [(_f = process.env.BUT1_FBL_GR5_ROLE_ID) !== null && _f !== void 0 ? _f : ""]: {
        type: types_1.Campus.Sen,
        grp: 5,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 5",
    },
    [(_g = process.env.BUT1_FBL_GR6_ROLE_ID) !== null && _g !== void 0 ? _g : ""]: {
        type: types_1.Campus.Sen,
        grp: 6,
        id: 50,
        name: "BUT 1 Site Fontainebleau Groupe 6",
    },
    [(_h = process.env.BUT2FA_FBL_ROLE_ID) !== null && _h !== void 0 ? _h : ""]: {
        type: types_1.Campus.Sen,
        grp: 1,
        id: 52,
        name: "BUT 2 Fa",
    },
    [(_j = process.env.BUT2FI_FBL_GR1_ROLE_ID) !== null && _j !== void 0 ? _j : ""]: {
        type: types_1.Campus.Sen,
        grp: 1,
        id: 51,
        name: "BUT 2 Fi Groupe 1",
    },
    [(_k = process.env.BUT2FI_FBL_GR2_ROLE_ID) !== null && _k !== void 0 ? _k : ""]: {
        type: types_1.Campus.Sen,
        grp: 2,
        id: 51,
        name: "BUT 2 Fi Groupe 2",
    },
    [(_l = process.env.BUT2FI_FBL_GR3_ROLE_ID) !== null && _l !== void 0 ? _l : ""]: {
        type: types_1.Campus.Sen,
        grp: 3,
        id: 51,
        name: "BUT 2 Fi Groupe 3",
    },
    [(_m = process.env.BUT3_FBL_ROLE_ID) !== null && _m !== void 0 ? _m : ""]: {
        type: types_1.Campus.Sen,
        grp: 1,
        id: 53,
        name: "BUT 3",
    },
};
exports.default = new Command_1.default()
    .setData((slash) => slash.setName("planning").setDescription("Pour avoir l'emploi du temps"))
    .setExecute((client, slash) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p;
    yield slash.deferReply({ ephemeral: true });
    let nextWeek = 0;
    let promo = null;
    // @ts-ignore
    for (const [roleId] of (_p = (_o = slash.member) === null || _o === void 0 ? void 0 : _o.roles) === null || _p === void 0 ? void 0 : _p.cache) {
        if (roleId in roles) {
            promo = roles[roleId];
        }
    }
    if (!promo) {
        return slash.editReply({
            content: "## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
        });
    }
    function makePlanning(promo, nextWeek, button) {
        return __awaiter(this, void 0, void 0, function* () {
            if (promo.type === types_1.Campus.Sen) {
                var { planning, url } = yield (0, fetchPlanning_1.fetchPlanningSenart)(nextWeek, promo.id);
            }
            else {
                var { planning, url } = yield (0, fetchPlanning_1.fetchPlanningFontainebleau)(nextWeek, promo.id, promo.grp);
            }
            const startOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .locale("fr")
                .startOf("week")
                .add(1, "day")
                .format("Do MMMM");
            const endOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .locale("fr")
                .endOf("week")
                .format("Do MMMM");
            const canvas = (0, makeCanvas_1.default)(planning);
            const content = {
                content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# ${promo.name}\n### *${startOfWeek} - ${endOfWeek}*`,
                components: [
                    (new discord_js_1.default.ActionRowBuilder().setComponents(new discord_js_1.default.ButtonBuilder()
                        .setStyle(discord_js_1.default.ButtonStyle.Primary)
                        .setLabel("🠐 Précédente Semaine")
                        .setCustomId("previous")
                        .setDisabled(nextWeek <= 0), new discord_js_1.default.ButtonBuilder()
                        .setStyle(discord_js_1.default.ButtonStyle.Primary)
                        .setLabel("Prochaine Semaine 🠒")
                        .setCustomId("next")
                        .setDisabled(nextWeek >= constants_1.MAX_WEEKS - 1))),
                ],
                files: [
                    new discord_js_1.default.AttachmentBuilder(canvas.toBuffer("image/png"), {
                        name: "planning.png",
                    }),
                ],
            };
            if (button) {
                return button.update(content);
            }
            return slash.editReply(content);
        });
    }
    const reply = yield makePlanning(promo, nextWeek, null);
    const collector = reply.createMessageComponentCollector({
        time: 60000,
        componentType: discord_js_1.default.ComponentType.Button,
    });
    collector.on("collect", (button) => __awaiter(void 0, void 0, void 0, function* () {
        collector.resetTimer();
        switch (button.customId) {
            case "previous":
                nextWeek--;
                break;
            case "next":
                nextWeek++;
                break;
        }
        yield makePlanning(promo, nextWeek, button);
    }));
}));
