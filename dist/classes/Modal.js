"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
class Modal {
    constructor() {
        this.data = null;
        this.execute = null;
    }
    setData(callback) {
        this.data = callback(new discord_js_1.default.ModalBuilder());
        return this;
    }
    setExecute(callback) {
        this.execute = callback;
        return this;
    }
}
exports.default = Modal;
Modal.ActionRowBuilder = discord_js_1.default.ActionRowBuilder;
Modal.TextInputBuilder = discord_js_1.default.TextInputBuilder;
Modal.TextInputStyle = discord_js_1.default.TextInputStyle;
