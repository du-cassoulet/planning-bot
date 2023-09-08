import Discord from "discord.js";

export enum Campus {
	Sen,
	Fbl,
}

export type ClassTime = {
	startHours: number;
	startMin: number;
	endHours: number;
	endMin: number;
};

export type RawClass = {
	time: ClassTime;
	day: number;
	textHTML: string;
};

export type Class = {
	time: ClassTime;
	day: number;
	title: string;
	room: string;
	details: string;
};

export type Promo = {
	type: Campus;
	grp: number;
	id: number | null;
	name: string;
};

export type CommandData = (
	slash: Discord.SlashCommandBuilder
) => Discord.SlashCommandBuilder;

export type CommandExecute = (
	client: Discord.Client,
	slash: Discord.ChatInputCommandInteraction
) => any;

export type AutocompleteExecute = (
	client: Discord.Client,
	slash: Discord.ChatInputCommandInteraction
) => any;
