import Discord from "discord.js";
import Command from "../classes/Command";
import User from "../models/User";
import { ActionRow, UserData } from "../types";
import registerEmail from "../modals/registerEmail";
import roles from "../roles";

export default new Command()
	.setData((slash) =>
		slash
			.setName("notify")
			.setDescription(
				"Pour recevoir des notifications lors des modifications de l'emoloi du temps."
			)
	)
	.setExecute(async ({ client, slash }) => {
		let user = await User.findOne({ discordId: slash.user.id });
		let promoId: string | null = null;

		for (const [roleId] of (
			slash.member?.roles as Discord.GuildMemberRoleManager
		).cache) {
			if (roleId in roles) {
				promoId = roleId;
			}
		}

		if (!promoId) {
			return slash.reply({
				content:
					"## <:cross:896682404410982450> Erreur\nJe n'ai pas réussi à reconnaître ta promo, assure toi d'avoir les bons rôles.\nSi le problème persiste, merci de bien vouloir contacter <@532631412717649941>.",
				ephemeral: true,
			});
		}

		if (!user) {
			const doc = new User({ discordId: slash.user.id, promoRoleId: promoId });
			user = await doc.save();
		}

		const messageData = (user: UserData, disabled: boolean) => ({
			content: `## <:beta1:1143159356431536198><:beta2:1143159353990447165><:beta3:1143159352337911859> L'application est encore dans sa beta.\nSi vous avez des doutes quant à vôtre emploi du temps, merci de consulter [ce site](${
				roles[<string>promoId].url
			}).\nLe code souce github est valable sur [ce lien](https://github.com/du-cassoulet/planning-bot).\n# :email: Notifications\nPour recevoir des notifications lorsque l'emploi du temps est modifié.`,
			ephemeral: true,
			components: [<ActionRow>new Discord.ActionRowBuilder().setComponents(
					new Discord.ButtonBuilder()
						.setCustomId("toggle-discord")
						.setStyle(
							user.notifyByDiscord
								? Discord.ButtonStyle.Success
								: Discord.ButtonStyle.Danger
						)
						.setLabel(
							user.notifyByDiscord
								? "Notifications par Discord activées"
								: "Notifications par Discord désactivées"
						)
						.setDisabled(disabled),
					new Discord.ButtonBuilder()
						.setCustomId("toggle-email")
						.setStyle(
							!user.email
								? Discord.ButtonStyle.Secondary
								: user.notifyByEmail
								? Discord.ButtonStyle.Success
								: Discord.ButtonStyle.Danger
						)
						.setLabel(
							!user.email
								? "Notifications par Email"
								: user.notifyByEmail
								? "Notifications par Email activées"
								: "Notifications par Email désactivées"
						)
						.setDisabled(disabled)
				)],
		});

		const reply = await slash.reply(messageData(user, false));

		async function updateMessageData() {
			const user = await User.findOne({ discordId: slash.user.id });
			return slash.editReply(messageData(<UserData>user, false));
		}

		const collector = reply.createMessageComponentCollector({
			time: 180_000,
		});

		collector.on("collect", async (button) => {
			collector.resetTimer();

			switch (button.customId) {
				case "toggle-discord":
					user?.set("notifyByDiscord", !user.notifyByDiscord);
					await user?.save();
					await button.update(messageData(<UserData>user, false));
					break;

				case "toggle-email":
					if (!user?.email) {
						client.addListener(
							`emailUpdate-${slash.user.id}`,
							updateMessageData
						);

						return button.showModal(<Discord.ModalBuilder>registerEmail.data);
					}

					user?.set("notifyByEmail", !user.notifyByEmail);
					await user?.save();
					await button.update(messageData(<UserData>user, false));

					break;
			}
		});

		collector.on("end", async () => {
			client.removeListener(`emailUpdate-${slash.user.id}`, updateMessageData);

			try {
				await slash.editReply(messageData(<UserData>user, true));
			} catch {}
		});
	});
