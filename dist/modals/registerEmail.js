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
const Modal_1 = __importDefault(require("../classes/Modal"));
const User_1 = __importDefault(require("../models/User"));
exports.default = new Modal_1.default()
    .setData((modal) => modal
    .setTitle("Enregistrer votre email")
    .setCustomId("register-email")
    .setComponents((new Modal_1.default.ActionRowBuilder().setComponents(new Modal_1.default.TextInputBuilder()
    .setCustomId("email-field")
    .setStyle(Modal_1.default.TextInputStyle.Short)
    .setLabel("Adresse email")
    .setPlaceholder("john.doe@etu.u-pec.fr")
    .setRequired(true)))))
    .setExecute(({ client, slash }) => __awaiter(void 0, void 0, void 0, function* () {
    const email = slash.fields.getTextInputValue("email-field");
    const userExists = yield User_1.default.exists({ discordId: slash.user.id });
    if (userExists) {
        yield User_1.default.findOneAndUpdate({ discordId: slash.user.id }, { email, notifyByEmail: true });
    }
    else {
        const doc = new User_1.default({
            discordId: slash.user.id,
            email,
            notifyByEmail: true,
        });
        yield doc.save();
    }
    client.emit(`emailUpdate-${slash.user.id}`);
    yield slash.deferUpdate();
}));
