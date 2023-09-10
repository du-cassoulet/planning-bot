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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
class Client extends discord_js_1.default.Client {
    constructor() {
        const intents = [
            discord_js_1.default.IntentsBitField.Flags.Guilds,
            discord_js_1.default.IntentsBitField.Flags.GuildMessages,
            discord_js_1.default.IntentsBitField.Flags.GuildMembers,
        ];
        super({ intents });
        this.commands = new discord_js_1.default.Collection();
        this.modals = new discord_js_1.default.Collection();
    }
    fetchData(root, collection) {
        const dirs = fs_1.default.readdirSync(root);
        dirs.forEach((dir) => {
            var _a, _b;
            const dirPath = path_1.default.join(root, dir);
            if (fs_1.default.lstatSync(dirPath).isDirectory()) {
                return this.fetchCommands(dirPath);
            }
            else {
                const element = require(dirPath).default;
                if (!element.data)
                    return;
                return collection.set((_a = element.data.name) !== null && _a !== void 0 ? _a : (_b = element.data.data) === null || _b === void 0 ? void 0 : _b.custom_id, Object.assign(Object.assign({}, element), { file: dir }));
            }
        });
    }
    fetchCommands(root = path_1.default.join(__dirname, "../commands")) {
        this.fetchData(root, this.commands);
    }
    fetchModals(root = path_1.default.join(__dirname, "../modals")) {
        this.fetchData(root, this.modals);
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
    connectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            yield mongoose_1.default.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@planning.9xatjwi.mongodb.net/?retryWrites=true&w=majority`);
            console.log(`Connected to the database in ${Date.now() - start}ms.`);
        });
    }
    start(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fetchEvents();
            this.fetchCommands();
            this.fetchModals();
            yield this.connectDb();
            this.login(token);
        });
    }
}
exports.default = Client;
