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
    .setDescription("Pour recevoir des notifications lors des modifications de l'emoloi du temps.")
    .setDMPermission(false)
    .setNSFW(false))
    .setDetails((details) => details.setDocumentation({
    label: "Comment l'utiliser ?",
    icon: "<:neonredcheckmark:1150387169882554379>",
    value: "Lors de l'utilisation de cette commande, un **menu** avec **deux boutons** est affiché. Un bouton pour activer/désactiver les notifications sur **Discord**, et un autre pour activer/désactiver les notifications par **email**. Si **aucune** adresse email n'est enregistrée à vôtre nom dans la **base de données**, celle-ci vous sera **demandée** via ce même bouton.",
}, {
    label: "A quoi ça sert ?",
    icon: "<:neonredsparkles:1150387167735070870>",
    value: "Cette commande vous permet de recevoir des notifications lorsque des changements seront effectués dans les emplois du temps de votre promo, que vous soyez sur le site de [Fontainebleau](<http://www.iut-fbleau.fr/EDT/consulter>) ou celui de [Sénart](<https://dynasis.iutsf.org/index.php?group_id=6&id=14>) et de gérer par quel moyen vous les recevrez, les moyens disponibles sont par Discord ou par email.",
}, {
    label: "Comment ça fonctionne ?",
    icon: "<:neonredactivedev:1150389568911192164>",
    value: "Tout d'abord, le programme recherche si l'utilisateur possède un **role** indiquand sa promo, si non, une **erreur** est renvoyée. Ensuite un message comportant **deux boutons** est envoyé, un [component collector](<https://tinyurl.com/29m8az8r>) récolte chaque **interactions de boutons** et fait basculer les valeurs corresondantes au **type** de notifications dans la [base de données](<https://www.mongodb.com>). Une boucle d'intervale de 5 minutes se lance lorsque l'évènement [ready](<https://tinyurl.com/4av9cen6>) vérifie quels cours ont été changés et envoie une notification aux utilisateurs ayant les valeurs correspondantes dans la base de données.",
}))
    .setExecute(({ client, slash }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let user = yield User_1.default.findOne({ discordId: slash.user.id });
    let promoId = null;
    for (const [roleId] of ((_a = slash.member) === null || _a === void 0 ? void 0 : _a.roles).cache) {
        if (roleId in roles_1.default) {
            promoId = roleId;
            break;
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
    else if (!user.promoRoleId) {
        user.set("promoRoleId", promoId);
        yield user.save();
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
            user = yield User_1.default.findOne({ discordId: slash.user.id });
            yield slash.editReply(messageData(user, false));
            return client.removeListener(`emailUpdate-${slash.user.id}`, updateMessageData);
        });
    }
    client.addListener(`emailUpdate-${slash.user.id}`, updateMessageData);
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
