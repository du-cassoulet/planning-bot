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
exports.default = new Event_1.default(discord_js_1.default.Events.InteractionCreate, (client, slash) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slash.isChatInputCommand())
        return;
    const command = client.commands.get(slash.commandName);
    if (!(command === null || command === void 0 ? void 0 : command.execute))
        return;
    return command.execute(client, slash);
}));
