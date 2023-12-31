"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PromoSchema = new mongoose_1.Schema({
    roleId: {
        type: String,
        required: true,
        unique: true,
    },
    students: {
        type: Array,
        required: true,
        unique: false,
        default: [],
    },
});
exports.default = (0, mongoose_1.model)("Promo", PromoSchema);
