"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Client extends discord_js_1.default.Client {
    constructor() {
        const intents = [
            discord_js_1.default.IntentsBitField.Flags.Guilds,
            discord_js_1.default.IntentsBitField.Flags.GuildMessages,
            discord_js_1.default.IntentsBitField.Flags.GuildMembers,
        ];
        super({ intents });
        this.commands = new discord_js_1.default.Collection();
    }
    fetchCommands(root = path_1.default.join(__dirname, "../commands")) {
        const dirs = fs_1.default.readdirSync(root);
        dirs.forEach((dir) => {
            const dirPath = path_1.default.join(root, dir);
            if (fs_1.default.lstatSync(dirPath).isDirectory()) {
                return this.fetchCommands(dirPath);
            }
            else {
                const command = require(dirPath).default;
                if (!command.data)
                    return;
                return this.commands.set(command.data.name, command);
            }
        });
    }
    fetchEvents(root = path_1.default.join(__dirname, "../events")) {
        const dirs = fs_1.default.readdirSync(root);
        dirs.forEach((dir) => {
            const dirPath = path_1.default.join(root, dir);
            if (fs_1.default.lstatSync(dirPath).isDirectory()) {
                return this.fetchCommands(dirPath);
            }
            else {
                const event = require(dirPath).default;
                return this.on(event.eventName, (...args) => event.execute(this, ...args));
            }
        });
    }
    start(token) {
        this.fetchEvents();
        this.fetchCommands();
        this.login(token);
    }
}
exports.default = Client;
