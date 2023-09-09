import Discord from "discord.js";
import Command from "../classes/Command";
import makeCanvas from "../utils/makeCanvas";
import { ActionRow, Campus, Promo } from "../types";
import { MAX_WEEKS } from "../constants";
import roles from "../roles";
import moment from "moment";

import {
	fetchPlanningFontainebleau,
	fetchPlanningSenart,
} from "../utils/fetchPlanning";

export default new Command()
	.setData((slash) =>
		slash.setName("planning").setDescription("Pour avoir l'emploi du temps")
	)
	.setExecute(async ({ slash }) => {
		let nextWeek = 0;
		let promo: Promo | null = null;

		for (const [roleId] of (
			slash.member?.roles as Discord.GuildMemberRoleManager
		).cache) {
			if (roleId in roles) {
				promo = roles[roleId];
			}
		}

		if (!promo) {
			return slash.reply({
				content:
					"## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
				ephemeral: true,
			});
		}

		await slash.deferReply({ ephemeral: true });

		async function makePlanning(
			promo: Promo,
			nextWeek: number,
			button: Discord.ButtonInteraction | null,
			disabled: boolean
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
				.startOf("week");

			const endOfWeek = moment(Date.now() + 6.048e8 * nextWeek)
				.locale("fr")
				.endOf("week");

			const content:
				| string
				| Discord.InteractionReplyOptions
				| Discord.MessagePayload = {
				content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${url}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# <:education:1150018279948173445> ${
					promo.name
				}\n### *${startOfWeek.format("Do MMMM")} - ${endOfWeek.format(
					"Do MMMM"
				)}*`,
				components: [<ActionRow>new Discord.ActionRowBuilder().setComponents(
						new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Primary)
							.setLabel("🠐 Précédente Semaine")
							.setCustomId("previous")
							.setDisabled(disabled || nextWeek <= 0),
						new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Primary)
							.setLabel("Prochaine Semaine 🠒")
							.setCustomId("next")
							.setDisabled(disabled || nextWeek >= MAX_WEEKS - 1)
					)],
				files: [
					new Discord.AttachmentBuilder(
						makeCanvas(planning).toBuffer("image/png"),
						{
							name: `planning-${startOfWeek.format(
								"DD-MM-YY"
							)}-${endOfWeek.format("DD-MM-YY")}.png`,
						}
					),
				],
			};

			if (button) {
				return button.update(
					<
						Discord.InteractionUpdateOptions & {
							fetchReply: true;
						}
					>content
				);
			}

			return slash.editReply(content);
		}

		const reply = await makePlanning(promo, nextWeek, null, false);

		const collector = reply.createMessageComponentCollector({
			time: 180_000,
			componentType: Discord.ComponentType.Button,
		});

		collector.on("collect", async (button) => {
			collector.resetTimer();

			switch (button.customId) {
				case "previous":
					nextWeek--;
					break;

				case "next":
					nextWeek++;
					break;
			}

			await makePlanning(<Promo>promo, nextWeek, button, false);
		});

		collector.on("end", async () => {
			try {
				await makePlanning(<Promo>promo, nextWeek, null, true);
			} catch {}
		});
	});
