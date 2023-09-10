"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDetailsBuilder = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
class CommandDetailsBuilder {
    constructor() {
        this.documentation = null;
    }
    setDocumentation(...documentation) {
        this.documentation = documentation;
        return this;
    }
}
exports.CommandDetailsBuilder = CommandDetailsBuilder;
class Command {
    constructor() {
        this.data = null;
        this.execute = null;
        this.autocomplete = null;
        this.details = null;
    }
    setData(callback) {
        this.data = callback(new discord_js_1.default.SlashCommandBuilder());
        return this;
    }
    setDetails(callback) {
        this.details = callback(new CommandDetailsBuilder());
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
