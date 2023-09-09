"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Client_1 = __importDefault(require("./classes/Client"));
const client = new Client_1.default();
client.start(process.env.TOKEN);
process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);
process.on("uncaughtExceptionMonitor", console.log);
process.on("rejectionHandled", console.log);
process.on("warning", console.warn);
