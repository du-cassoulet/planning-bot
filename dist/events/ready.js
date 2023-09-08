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
exports.default = new Event_1.default(discord_js_1.default.Events.ClientReady, (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`Logged as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.displayName}`);
    const guild = client.guilds.cache.get((_b = process.env.GUILD_ID) !== null && _b !== void 0 ? _b : "");
    if (!guild)
        throw new Error("Failed to connect to the guild.");
    yield guild.commands.set(client.commands.map((command) => command.data));
    return console.log(`${client.commands.size} commands published.`);
}));
