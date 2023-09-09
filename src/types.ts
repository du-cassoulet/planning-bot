import Discord from "discord.js";

export enum Campus {
	Sen,
	Fbl,
}

export type RawClassSenHeader = {
	left: string;
	center: string;
	right: string;
};

export type RawClassSenEvent = {
	title: string;
	start: string;
	end: string;
};

export type RawClassSen = {
	header: RawClassSenHeader;
	defaultDate: string;
	defaultView: string;
	scrollTime: string;
	minTime: string;
	maxTime: string;
	navLinks: boolean;
	locale: string;
	noEventsMessage: string;
	hiddenDays: number[];
	editable: boolean;
	eventLimit: boolean;
	events: RawClassSenEvent[];
};

export type RawClassFbl = {
	end: string;
	nomADE: string;
	numero: string;
	resourceId: string;
	salle: string;
	start: string;
	title: string;
};

export type ClassTime = {
	startHours: number;
	startMin: number;
	endHours: number;
	endMin: number;
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
