"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pov = exports.Off = exports.Promo = exports.FBL_URL = exports.SEN_URL = void 0;
const types_1 = require("./types");
exports.SEN_URL = "https://dynasis.iutsf.org/index.php?group_id=6&id=14";
exports.FBL_URL = "http://www.iut-fbleau.fr/EDT/consulter";
class Promo {
    constructor(year, campus, grp, id) {
        this.campus = campus;
        this.grp = grp;
        this.id = id;
        this.year = year;
    }
    get url() {
        return this.campus === types_1.Campus.Sen ? exports.SEN_URL : exports.FBL_URL;
    }
    get name() {
        return (this.year +
            " " +
            (this.campus === types_1.Campus.Sen ? "Site Sénart" : "Site Fontainebleau") +
            (this.grp > 0 ? ` Groupe ${this.grp}` : ""));
    }
}
exports.Promo = Promo;
const { BUT1_OFF_SEN_ID, BUT1_OFF_FBL_GR1_ID, BUT1_OFF_FBL_GR2_ID, BUT1_OFF_FBL_GR3_ID, BUT1_OFF_FBL_GR4_ID, BUT1_OFF_FBL_GR5_ID, BUT1_OFF_FBL_GR6_ID, BUT2FA_OFF_FBL_ID, BUT2FI_OFF_FBL_GR1_ID, BUT2FI_OFF_FBL_GR2_ID, BUT2FI_OFF_FBL_GR3_ID, BUT3_OFF_FBL_ID, BUT1_POV_SEN_ID, BUT1_POV_FBL_GR1_ID, BUT1_POV_FBL_GR2_ID, BUT1_POV_FBL_GR3_ID, BUT1_POV_FBL_GR4_ID, BUT1_POV_FBL_GR5_ID, BUT1_POV_FBL_GR6_ID, BUT2FA_POV_FBL_ID, BUT2FI_POV_FBL_GR1_ID, BUT2FI_POV_FBL_GR2_ID, BUT2FI_POV_FBL_GR3_ID, BUT3_POV_FBL_ID, } = process.env;
exports.Off = {
    [BUT1_OFF_SEN_ID]: new Promo("BUT 1", types_1.Campus.Sen, 0, 14),
    [BUT1_OFF_FBL_GR1_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 1, 50),
    [BUT1_OFF_FBL_GR2_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 2, 50),
    [BUT1_OFF_FBL_GR3_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 3, 50),
    [BUT1_OFF_FBL_GR4_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 4, 50),
    [BUT1_OFF_FBL_GR5_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 5, 50),
    [BUT1_OFF_FBL_GR6_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 6, 50),
    [BUT2FA_OFF_FBL_ID]: new Promo("BUT 2 Fa", types_1.Campus.Fbl, 1, 52),
    [BUT2FI_OFF_FBL_GR1_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 1, 51),
    [BUT2FI_OFF_FBL_GR2_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 2, 51),
    [BUT2FI_OFF_FBL_GR3_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 3, 51),
    [BUT3_OFF_FBL_ID]: new Promo("BUT 3", types_1.Campus.Fbl, 1, 53),
};
exports.Pov = {
    [BUT1_POV_SEN_ID]: new Promo("BUT 1", types_1.Campus.Sen, 0, 14),
    [BUT1_POV_FBL_GR1_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 1, 50),
    [BUT1_POV_FBL_GR2_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 2, 50),
    [BUT1_POV_FBL_GR3_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 3, 50),
    [BUT1_POV_FBL_GR4_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 4, 50),
    [BUT1_POV_FBL_GR5_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 5, 50),
    [BUT1_POV_FBL_GR6_ID]: new Promo("BUT 1", types_1.Campus.Fbl, 6, 50),
    [BUT2FA_POV_FBL_ID]: new Promo("BUT 2 Fa", types_1.Campus.Fbl, 1, 52),
    [BUT2FI_POV_FBL_GR1_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 1, 51),
    [BUT2FI_POV_FBL_GR2_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 2, 51),
    [BUT2FI_POV_FBL_GR3_ID]: new Promo("BUT 2 Fi", types_1.Campus.Fbl, 3, 51),
    [BUT3_POV_FBL_ID]: new Promo("BUT 3", types_1.Campus.Fbl, 1, 53),
};
exports.default = Object.assign(Object.assign({}, exports.Off), exports.Pov);
