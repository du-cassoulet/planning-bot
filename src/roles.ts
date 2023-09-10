import { Campus } from "./types";

export const SEN_URL = "https://dynasis.iutsf.org/index.php?group_id=6&id=14";
export const FBL_URL = "http://www.iut-fbleau.fr/EDT/consulter";

export class Promo {
	public campus: Campus;
	public grp: number;
	public id: number;
	private year: string;

	constructor(year: string, campus: Campus, grp: number, id: number) {
		this.campus = campus;
		this.grp = grp;
		this.id = id;
		this.year = year;
	}

	public get url() {
		return this.campus === Campus.Sen ? SEN_URL : FBL_URL;
	}

	public get name() {
		return (
			this.year +
			" " +
			(this.campus === Campus.Sen ? "Site Sénart" : "Site Fontainebleau") +
			(this.grp > 0 ? ` Groupe ${this.grp}` : "")
		);
	}
}

const {
	BUT1_OFF_SEN_ID,
	BUT1_OFF_FBL_GR1_ID,
	BUT1_OFF_FBL_GR2_ID,
	BUT1_OFF_FBL_GR3_ID,
	BUT1_OFF_FBL_GR4_ID,
	BUT1_OFF_FBL_GR5_ID,
	BUT1_OFF_FBL_GR6_ID,
	BUT2FA_OFF_FBL_ID,
	BUT2FI_OFF_FBL_GR1_ID,
	BUT2FI_OFF_FBL_GR2_ID,
	BUT2FI_OFF_FBL_GR3_ID,
	BUT3_OFF_FBL_ID,

	BUT1_POV_SEN_ID,
	BUT1_POV_FBL_GR1_ID,
	BUT1_POV_FBL_GR2_ID,
	BUT1_POV_FBL_GR3_ID,
	BUT1_POV_FBL_GR4_ID,
	BUT1_POV_FBL_GR5_ID,
	BUT1_POV_FBL_GR6_ID,
	BUT2FA_POV_FBL_ID,
	BUT2FI_POV_FBL_GR1_ID,
	BUT2FI_POV_FBL_GR2_ID,
	BUT2FI_POV_FBL_GR3_ID,
	BUT3_POV_FBL_ID,
} = process.env;

export const Off = {
	[<string>BUT1_OFF_SEN_ID]: new Promo("BUT 1", Campus.Sen, 0, 14),
	[<string>BUT1_OFF_FBL_GR1_ID]: new Promo("BUT 1", Campus.Fbl, 1, 50),
	[<string>BUT1_OFF_FBL_GR2_ID]: new Promo("BUT 1", Campus.Fbl, 2, 50),
	[<string>BUT1_OFF_FBL_GR3_ID]: new Promo("BUT 1", Campus.Fbl, 3, 50),
	[<string>BUT1_OFF_FBL_GR4_ID]: new Promo("BUT 1", Campus.Fbl, 4, 50),
	[<string>BUT1_OFF_FBL_GR5_ID]: new Promo("BUT 1", Campus.Fbl, 5, 50),
	[<string>BUT1_OFF_FBL_GR6_ID]: new Promo("BUT 1", Campus.Fbl, 6, 50),
	[<string>BUT2FA_OFF_FBL_ID]: new Promo("BUT 2 Fa", Campus.Fbl, 1, 52),
	[<string>BUT2FI_OFF_FBL_GR1_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 1, 51),
	[<string>BUT2FI_OFF_FBL_GR2_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 2, 51),
	[<string>BUT2FI_OFF_FBL_GR3_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 3, 51),
	[<string>BUT3_OFF_FBL_ID]: new Promo("BUT 3", Campus.Fbl, 1, 53),
};

export const Pov = {
	[<string>BUT1_POV_SEN_ID]: new Promo("BUT 1", Campus.Sen, 0, 14),
	[<string>BUT1_POV_FBL_GR1_ID]: new Promo("BUT 1", Campus.Fbl, 1, 50),
	[<string>BUT1_POV_FBL_GR2_ID]: new Promo("BUT 1", Campus.Fbl, 2, 50),
	[<string>BUT1_POV_FBL_GR3_ID]: new Promo("BUT 1", Campus.Fbl, 3, 50),
	[<string>BUT1_POV_FBL_GR4_ID]: new Promo("BUT 1", Campus.Fbl, 4, 50),
	[<string>BUT1_POV_FBL_GR5_ID]: new Promo("BUT 1", Campus.Fbl, 5, 50),
	[<string>BUT1_POV_FBL_GR6_ID]: new Promo("BUT 1", Campus.Fbl, 6, 50),
	[<string>BUT2FA_POV_FBL_ID]: new Promo("BUT 2 Fa", Campus.Fbl, 1, 52),
	[<string>BUT2FI_POV_FBL_GR1_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 1, 51),
	[<string>BUT2FI_POV_FBL_GR2_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 2, 51),
	[<string>BUT2FI_POV_FBL_GR3_ID]: new Promo("BUT 2 Fi", Campus.Fbl, 3, 51),
	[<string>BUT3_POV_FBL_ID]: new Promo("BUT 3", Campus.Fbl, 1, 53),
};

export default { ...Off, ...Pov };
