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
const fetchPlanning_1 = require("../utils/fetchPlanning");
const makeCanvas_1 = __importDefault(require("../utils/makeCanvas"));
exports.default = new Command_1.default()
    .setData((slash) => slash.setName("planning").setDescription("Pour avoir l'emploi du temps"))
    .setExecute((client, slash) => __awaiter(void 0, void 0, void 0, function* () {
    yield slash.deferReply({ ephemeral: true });
    const planning = yield (0, fetchPlanning_1.fetchPlanningSenart)();
    const canvas = (0, makeCanvas_1.default)(planning);
    return slash.editReply({
        files: [
            new discord_js_1.default.AttachmentBuilder(canvas.toBuffer("image/png"), {
                name: "planning.png",
            }),
        ],
    });
}));
