import Discord from "discord.js";
import Command from "../classes/Command";
import makeCanvas from "../utils/makeCanvas";
import { Campus, Promo } from "../types";
import { MAX_WEEKS } from "../constants";
import moment from "moment";

import {
	fetchPlanningFontainebleau,
	fetchPlanningSenart,
} from "../utils/fetchPlanning";

const roles = {
	[process.env.BUT1_SEN_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 1,
		id: 14,
		name: "BUT 1 Site Sénart",
	},
	[process.env.BUT1_FBL_GR1_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 1,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 1",
	},
	[process.env.BUT1_FBL_GR2_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 2,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 2",
	},
	[process.env.BUT1_FBL_GR3_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 3,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 3",
	},
	[process.env.BUT1_FBL_GR4_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 4,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 4",
	},
	[process.env.BUT1_FBL_GR5_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 5,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 5",
	},
	[process.env.BUT1_FBL_GR6_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 6,
		id: 50,
		name: "BUT 1 Site Fontainebleau Groupe 6",
	},
	[process.env.BUT2FA_FBL_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 1,
		id: 52,
		name: "BUT 2 Fa",
	},
	[process.env.BUT2FI_FBL_GR1_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 1,
		id: 51,
		name: "BUT 2 Fi Groupe 1",
	},
	[process.env.BUT2FI_FBL_GR2_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 2,
		id: 51,
		name: "BUT 2 Fi Groupe 2",
	},
	[process.env.BUT2FI_FBL_GR3_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 3,
		id: 51,
		name: "BUT 2 Fi Groupe 3",
	},
	[process.env.BUT3_FBL_ROLE_ID ?? ""]: {
		type: Campus.Sen,
		grp: 1,
		id: 53,
		name: "BUT 3",
	},
};

export default new Command()
	.setData((slash) =>
		slash.setName("planning").setDescription("Pour avoir l'emploi du temps")
	)
	.setExecute(async (client, slash) => {
		await slash.deferReply({ ephemeral: true });

		let nextWeek = 0;
		let promo: Promo | null = null;

		// @ts-ignore
		for (const [roleId] of slash.member?.roles?.cache) {
			if (roleId in roles) {
				promo = roles[roleId];
			}
		}

		if (!promo) {
			return slash.editReply({
				content:
					"## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
			});
		}

		async function makePlanning(
			promo: Promo,
			nextWeek: number,
			button: Discord.ButtonInteraction | null
		) {
			if (promo.type === Campus.Sen) {
				var { planning, url } = await fetchPlanningSenart(
					nextWeek,
					<number>promo.id
				);
			} else {
				var { planning, url } = await fetchPlanningFontainebleau(
					nextWeek,
					<number>promo.id,
					promo.grp
				);
			}

			const startOfWeek = moment(Date.now() + 6.048e8 * nextWeek)
				.locale("fr")
				.startOf("week")
				.add(1, "day")
				.format("Do MMMM");

			const endOfWeek = moment(Date.now() + 6.048e8 * nextWeek)
				.locale("fr")
				.endOf("week")
				.format("Do MMMM");

			const canvas = makeCanvas(planning);
			const content = {
				content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# ${promo.name}\n### *${startOfWeek} - ${endOfWeek}*`,
				components: [
					<Discord.ActionRowBuilder<any>>(
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setStyle(Discord.ButtonStyle.Primary)
								.setLabel("🠐 Précédente Semaine")
								.setCustomId("previous")
								.setDisabled(nextWeek <= 0),
							new Discord.ButtonBuilder()
								.setStyle(Discord.ButtonStyle.Primary)
								.setLabel("Prochaine Semaine 🠒")
								.setCustomId("next")
								.setDisabled(nextWeek >= MAX_WEEKS - 1)
						)
					),
				],
				files: [
					new Discord.AttachmentBuilder(canvas.toBuffer("image/png"), {
						name: "planning.png",
					}),
				],
			};

			if (button) {
				return button.update(content);
			}

			return slash.editReply(content);
		}

		const reply: any = await makePlanning(promo, nextWeek, null);

		const collector = reply.createMessageComponentCollector({
			time: 60_000,
			componentType: Discord.ComponentType.Button,
		});

		collector.on("collect", async (button: Discord.ButtonInteraction) => {
			collector.resetTimer();

			switch (button.customId) {
				case "previous":
					nextWeek--;
					break;

				case "next":
					nextWeek++;
					break;
			}

			await makePlanning(<Promo>promo, nextWeek, button);
		});
	});
