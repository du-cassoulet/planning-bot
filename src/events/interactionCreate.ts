import Discord from "discord.js";
import Event from "../classes/Event";

export default new Event(
	Discord.Events.InteractionCreate,
	async (client, slash: Discord.Interaction) => {
		if (!slash.isChatInputCommand()) return;

		const command = client.commands.get(slash.commandName);
		if (!command?.execute) return;

		return command.execute(client, slash);
	}
);
