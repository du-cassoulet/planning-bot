"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
class Command {
    constructor() {
        this.data = null;
        this.execute = null;
        this.autocomplete = null;
    }
    setData(callback) {
        this.data = callback(new discord_js_1.default.SlashCommandBuilder());
        return this;
    }
    setExecute(callback) {
        this.execute = callback;
        return this;
    }
    setAutocomplete(callback) {
        this.autocomplete = callback;
        return this;
    }
}
exports.default = Command;
