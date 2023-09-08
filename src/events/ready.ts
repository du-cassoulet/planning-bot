import Discord from "discord.js";
import Event from "../classes/Event";

export default new Event(Discord.Events.ClientReady, async (client) => {
	console.log(`Logged as ${client.user?.displayName}`);

	const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
	if (!guild) throw new Error("Failed to connect to the guild.");

	await guild.commands.set(
		client.commands.map(
			(command) => <Discord.ApplicationCommandDataResolvable>command.data
		)
	);

	return console.log(`${client.commands.size} commands published.`);
});
