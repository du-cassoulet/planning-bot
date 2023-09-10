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
const Command_1 = __importDefault(require("../classes/Command"));
const makeCanvas_1 = __importDefault(require("../utils/makeCanvas"));
const types_1 = require("../types");
const constants_1 = require("../constants");
const roles_1 = __importDefault(require("../roles"));
const moment_1 = __importDefault(require("moment"));
const fetchPlanning_1 = require("../utils/fetchPlanning");
exports.default = new Command_1.default()
    .setData((slash) => slash
    .setName("planning")
    .setDescription("Pour avoir l'emploi du temps")
    .setDMPermission(false)
    .setNSFW(false))
    .setDetails((details) => details.setDocumentation({
    label: "Comment l'utiliser ?",
    icon: "<:neonredcheckmark:1150387169882554379>",
    value: "Vous ne pouvez utiliser cette commande que si vous avez **le role de votre promo**. Si ce n'est pas le cas, adressez vous à un des **administrateur** du serveur qui vous octroiera votre role. Verifiez aussi que le rôle que vous possédez est **supporté** par le bot, pour cela vous pouvez contacter le **créateur du bot** ou un **administrateur** du serveur.",
}, {
    label: "A quoi ça sert ?",
    icon: "<:neonredsparkles:1150387167735070870>",
    value: "Cette commande permet d'afficher **l'emploi du temps** de votre promo sous forme d'une image contenant tous les cours d'une semaine.\n**Deux boutons** vous permettront **d'avancer** ou de **reculer** d'une semaine, vous ne pouvez pas voir l'emploi du temps d'une semaine déjà passée et vous ne pouvez voir que de 10 semaines en avance.",
}, {
    label: "Comment ça fonctionne ?",
    icon: "<:neonredactivedev:1150389568911192164>",
    value: "Tout d'abord, le programme recherche si l'utilisateur possède un **role** pouvant indiquer sa promo, si non, une **erreur** est renvoyée. Ensuite en faisant des requêtes [GET](<https://fr.wikipedia.org/wiki/Hypertext_Transfer_Protocol>) aux sites d'emploi du temps de [Fontainebleau](<http://www.iut-fbleau.fr/EDT/consulter>) et de [Sénart](<https://dynasis.iutsf.org/index.php?group_id=6&id=14>), nous récupérons les valeurs [JSON](<https://fr.wikipedia.org/wiki/JavaScript_Object_Notation>) des **emplois du temps** de ceux-ci. Le programme formate ensuite les réponses pour les rendre **compatibles**. La librairie [canvas](<https://www.npmjs.com/package/canvas>) est ensuite utilisée afin de convertir ces données en une **image** lisible.",
}))
    .setExecute(({ slash }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let nextWeek = 0;
    let promo = null;
    for (const [roleId] of ((_a = slash.member) === null || _a === void 0 ? void 0 : _a.roles).cache) {
        if (roleId in roles_1.default) {
            promo = roles_1.default[roleId];
        }
    }
    if (!promo) {
        return slash.reply({
            content: "## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
            ephemeral: true,
        });
    }
    yield slash.deferReply({ ephemeral: true });
    function makePlanning(promo, nextWeek, button, disabled) {
        return __awaiter(this, void 0, void 0, function* () {
            if (promo.campus === types_1.Campus.Sen) {
                var { planning, url } = yield (0, fetchPlanning_1.fetchPlanningSenart)(nextWeek, promo.id);
            }
            else {
                var { planning, url } = yield (0, fetchPlanning_1.fetchPlanningFontainebleau)(nextWeek, promo.id, promo.grp);
            }
            const startOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .locale("fr")
                .startOf("week");
            const endOfWeek = (0, moment_1.default)(Date.now() + 6.048e8 * nextWeek)
                .locale("fr")
                .endOf("week");
            const content = {
                content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# <:education:1150018279948173445> ${promo.name}\n### *${startOfWeek.format("Do MMMM")} - ${endOfWeek.format("Do MMMM")}*`,
                components: [new discord_js_1.default.ActionRowBuilder().setComponents(new discord_js_1.default.ButtonBuilder()
                        .setStyle(discord_js_1.default.ButtonStyle.Primary)
                        .setLabel("🠐 Précédente Semaine")
                        .setCustomId("previous")
                        .setDisabled(disabled || nextWeek <= 0), new discord_js_1.default.ButtonBuilder()
                        .setStyle(discord_js_1.default.ButtonStyle.Primary)
                        .setLabel("Prochaine Semaine 🠒")
                        .setCustomId("next")
                        .setDisabled(disabled || nextWeek >= constants_1.MAX_WEEKS - 1))],
                files: [
                    new discord_js_1.default.AttachmentBuilder((0, makeCanvas_1.default)(planning).toBuffer("image/png"), {
                        name: `planning-${startOfWeek.format("DD-MM-YY")}-${endOfWeek.format("DD-MM-YY")}.png`,
                    }),
                ],
            };
            if (button) {
                return button.update(content);
            }
            return slash.editReply(content);
        });
    }
    const reply = yield makePlanning(promo, nextWeek, null, false);
    const collector = reply.createMessageComponentCollector({
        time: 180000,
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
        yield makePlanning(promo, nextWeek, button, false);
    }));
    collector.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield makePlanning(promo, nextWeek, null, true);
        }
        catch (_b) { }
    }));
}));
