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
const Command_1 = __importDefault(require("../classes/Command"));
const registerEmail_1 = __importDefault(require("../modals/registerEmail"));
exports.default = new Command_1.default()
    .setData((slash) => slash
    .setName("email")
    .setDescription("Pour changer votre adresse email.")
    .setDMPermission(false)
    .setNSFW(false))
    .setDetails((details) => details.setDocumentation({
    label: "Comment l'utiliser ?",
    icon: "<:neonredcheckmark:1150387169882554379>",
    value: "Directement après avoir exécuté l'application, une page dans laquelle une **adresse email** est demandée s'ouvre. Il vous suffit simplement de rentrer une **adresse email** sur laquelle vous souhaiteriez recevoir des **notifications**, accepter. L'email sera directement **enregistrée** dans la **base de données**.",
}, {
    label: "A quoi ça sert ?",
    icon: "<:neonredsparkles:1150387167735070870>",
    value: "Cette commande permet de **modifier** ou **d'ajouter** une **adresse email** à l'élément de l'utilisateur dans la **base de données**. Cet email est utilisé par l'outil de **notification** du bot et vient en complément à la commande du même nom.",
}, {
    label: "Comment ça fonctionne ?",
    icon: "<:neonredactivedev:1150389568911192164>",
    value: `Le programme répond à cette commande par **l'ouverture** d'un [modal](<https://discordjs.guide/interactions/modals.html>) dans lequel une **adresse email** est demandée. Une fois la validation des informations rentrées dans le **modal**, le programme **interceptera** l'évènement qu'il aura généré et **récoltera les informations** pour pouvoir les ajouter dans la [base de données](<https://www.mongodb.com>). Un **message de confirmation** est ensuite envoyé à l'utilisateur sur Discord.`,
}))
    .setExecute(({ client, slash }) => {
    slash.showModal(registerEmail_1.default.data);
    function sendValidationMessage(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield slash.user.send({
                content: `## :email: Changement d'adresse email\nVotre adresse email est maintenant **${email}**.`,
            });
            return client.removeListener(`emailUpdate-${slash.user.id}`, sendValidationMessage);
        });
    }
    client.addListener(`emailUpdate-${slash.user.id}`, sendValidationMessage);
    setTimeout(() => {
        client.removeListener(`emailUpdate-${slash.user.id}`, sendValidationMessage);
    }, 180000);
});
