"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    promoRoleId: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: false,
        unique: false,
    },
    notifyByDiscord: {
        type: Boolean,
        required: true,
        unique: false,
        default: false,
    },
    notifyByEmail: {
        type: Boolean,
        required: true,
        unique: false,
        default: false,
    },
});
exports.default = (0, mongoose_1.model)("User", UserSchema);
