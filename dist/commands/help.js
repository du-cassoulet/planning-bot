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
const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
exports.default = new Command_1.default()
    .setData((slash) => slash
    .setName("help")
    .setDescription("Pour obtenir de l'aide sur le bot ou sur une commande.")
    .setDMPermission(false)
    .setNSFW(false)
    .addStringOption((option) => option
    .setName("command")
    .setDescription("La commande pour laquelle vous avez besoin d'aide.")
    .setRequired(false)
    .setAutocomplete(true)))
    .setDetails((details) => details.setDocumentation({
    label: "A quoi ça sert ?",
    icon: "<:neonredsparkles:1150387167735070870>",
    value: "Cette commande permet d'afficher soit une **liste des commandes** disponibles sur le bot, soit d'afficher des **information complémentaires** sur une **commande en particulier**. Si vous souhaitez simplement avoir une **liste des commandes**, exécutez cette commande **sans remplir** l'argument optionnel \"commande\". Si au contraire, vous souhaitez avoir de l'aide quant à **l'utilisation** d'une commande, exécutez-la avec le **nom** de la commande pour laquelle vous voulez des informations dans l'argument optionnel \"commande\".",
}, {
    label: "Comment ça fonctionne ?",
    icon: "<:neonredactivedev:1150389568911192164>",
    value: "Le programme verifie si une **valeur** a été attribuée à l'argument \"commande\". Si oui, le nom de la commande est recherché dans la **liste des commandes** disponibles, si elle n'est **pas** trouvée, une **erreur** s'affichera. Sinon, les données de cette commande seront affichées en format **textuel lisible et compréhensible**. Si **aucune** valeur de lui est attribuée, le programme affichera la **liste des commandes**, leur **description** ainsi que quelques **informations complémentaires** sur le bot.",
}))
    .setAutocomplete(({ client, slash }) => {
    const query = slash.options.getFocused(false);
    const commands = client.commands.filter((c) => { var _a; return clean((_a = c.data) === null || _a === void 0 ? void 0 : _a.name).startsWith(clean(query)); });
    return slash.respond(commands
        .map((c) => {
        var _a, _b;
        return ({
            name: (_a = c.data) === null || _a === void 0 ? void 0 : _a.name,
            value: (_b = c.data) === null || _b === void 0 ? void 0 : _b.name,
        });
    })
        .slice(0, 25));
})
    .setExecute(({ client, slash }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const commandName = slash.options.getString("command", false);
    if (commandName) {
        const command = client.commands.get(commandName);
        if (!command) {
            return slash.reply({
                content: "## <:cross:896682404410982450> Erreur\nTu ne peux pas avoir d'aide sur une commande qui n'existe pas.",
                ephemeral: true,
            });
        }
        const commandId = (_b = (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.cache.find((c) => { var _a; return c.name === ((_a = command.data) === null || _a === void 0 ? void 0 : _a.name); })) === null || _b === void 0 ? void 0 : _b.id;
        return slash.reply({
            content: `# <:info:1089119342756638730> Aide pour la commande </${(_c = command.data) === null || _c === void 0 ? void 0 : _c.name}:${commandId}>\n*${(_d = command.data) === null || _d === void 0 ? void 0 : _d.description}*\n\n${(_f = (_e = command.details) === null || _e === void 0 ? void 0 : _e.documentation) === null || _f === void 0 ? void 0 : _f.map((d) => `## ${d.icon} ${d.label}\n${d.value}`).join("\n")}\n\nLe code source de cette commande est disponible sur [cette page](https://github.com/du-cassoulet/planning-bot/blob/main/src/commands/${command.file}).`,
            ephemeral: true,
        });
    }
    else {
        yield ((_g = client.application) === null || _g === void 0 ? void 0 : _g.fetch());
        return slash.reply({
            content: `# <:info:1089119342756638730> Aide générale\n*${(_h = client.user) === null || _h === void 0 ? void 0 : _h.toString()} est un bot crée bénévolement par ${(_k = (_j = client.application) === null || _j === void 0 ? void 0 : _j.owner) === null || _k === void 0 ? void 0 : _k.toString()} qui à pour but de faciliter l'accès et l'utilisation de l'emploi du temps.*\n## <:neonredbot:1150502017605828780> Commandes disponibles\n${(_l = client.application) === null || _l === void 0 ? void 0 : _l.commands.cache.map((command) => `- </${command.name}:${command.id}> *${command.description}*`).join("\n")}\n## <:neonredactivedev:1150389568911192164> Comment ça fonctionne ?\nLe bot utilise le langage de programmation [TypeScript](<https://www.typescriptlang.org>) compilé en [JavaScript](<https://fr.wikipedia.org/wiki/JavaScript>) et interprété par [Node.js](<https://nodejs.org>). Il utilise [discord.js](<https://discord.js.org>) pour se connecter au [WebSocket](<https://fr.wikipedia.org/wiki/WebSocket>) de discord. Afin de stocker les données essentielles comme l'adresse email ou encore la promo de l'étudiant, une base de données [NoSQL](<https://fr.wikipedia.org/wiki/NoSQL>) [Mongo DB](<https://www.mongodb.com>) est utilisée.\n\nLe code source de cette commande est disponible sur [cette page](https://github.com/du-cassoulet/planning-bot).`,
            ephemeral: true,
        });
    }
}));
