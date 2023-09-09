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
const User_1 = __importDefault(require("../models/User"));
const registerEmail_1 = __importDefault(require("../modals/registerEmail"));
const roles_1 = __importDefault(require("../roles"));
exports.default = new Command_1.default()
    .setData((slash) => slash
    .setName("notify")
    .setDescription("Pour recevoir des notifications lors des modifications de l'emoloi du temps."))
    .setExecute(({ client, slash }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let user = yield User_1.default.findOne({ discordId: slash.user.id });
    let promoId = null;
    for (const [roleId] of ((_a = slash.member) === null || _a === void 0 ? void 0 : _a.roles).cache) {
        if (roleId in roles_1.default) {
            promoId = roleId;
        }
    }
    if (!promoId) {
        return slash.reply({
            content: "## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
            ephemeral: true,
        });
    }
    if (!user) {
        const doc = new User_1.default({ discordId: slash.user.id, promoRoleId: promoId });
        user = yield doc.save();
    }
    const messageData = (user, disabled) => ({
        content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${roles_1.default[promoId].url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# :email: Notifications\nPour recevoir des notifications lorsque l'emploi du temps est modifié.`,
        ephemeral: true,
        components: [new discord_js_1.default.ActionRowBuilder().setComponents(new discord_js_1.default.ButtonBuilder()
                .setCustomId("toggle-discord")
                .setStyle(user.notifyByDiscord
                ? discord_js_1.default.ButtonStyle.Success
                : discord_js_1.default.ButtonStyle.Danger)
                .setLabel(user.notifyByDiscord
                ? "Notifications par Discord activées"
                : "Notifications par Discord désactivées")
                .setDisabled(disabled), new discord_js_1.default.ButtonBuilder()
                .setCustomId("toggle-email")
                .setStyle(!user.email
                ? discord_js_1.default.ButtonStyle.Secondary
                : user.notifyByEmail
                    ? discord_js_1.default.ButtonStyle.Success
                    : discord_js_1.default.ButtonStyle.Danger)
                .setLabel(!user.email
                ? "Notifications par Email"
                : user.notifyByEmail
                    ? "Notifications par Email activées"
                    : "Notifications par Email désactivées")
                .setDisabled(disabled))],
    });
    const reply = yield slash.reply(messageData(user, false));
    function updateMessageData() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ discordId: slash.user.id });
            return slash.editReply(messageData(user, false));
        });
    }
    const collector = reply.createMessageComponentCollector({
        time: 180000,
    });
    collector.on("collect", (button) => __awaiter(void 0, void 0, void 0, function* () {
        collector.resetTimer();
        switch (button.customId) {
            case "toggle-discord":
                user === null || user === void 0 ? void 0 : user.set("notifyByDiscord", !user.notifyByDiscord);
                yield (user === null || user === void 0 ? void 0 : user.save());
                yield button.update(messageData(user, false));
                break;
            case "toggle-email":
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    client.addListener(`emailUpdate-${slash.user.id}`, updateMessageData);
                    return button.showModal(registerEmail_1.default.data);
                }
                user === null || user === void 0 ? void 0 : user.set("notifyByEmail", !user.notifyByEmail);
                yield (user === null || user === void 0 ? void 0 : user.save());
                yield button.update(messageData(user, false));
                break;
        }
    }));
    collector.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        client.removeListener(`emailUpdate-${slash.user.id}`, updateMessageData);
        try {
            yield slash.editReply(messageData(user, true));
        }
        catch (_b) { }
    }));
}));
