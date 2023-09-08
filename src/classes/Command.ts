import Discord from "discord.js";

type CommandData = (
  slash: Discord.SlashCommandBuilder
) => Discord.SlashCommandBuilder;

type CommandExecute = (
  client: Discord.Client,
  slash: Discord.ChatInputCommandInteraction
) => any;

type AutocompleteExecute = (
  client: Discord.Client,
  slash: Discord.ChatInputCommandInteraction
) => any;

export default class Command {
  public data: Discord.SlashCommandBuilder | null;
  public execute: CommandExecute | null;
  public autocomplete: AutocompleteExecute | null;

  constructor() {
    this.data = null;
    this.execute = null;
    this.autocomplete = null;
  }

  public setData(callback: CommandData) {
    this.data = callback(new Discord.SlashCommandBuilder());
    return this;
  }

  public setExecute(callback: CommandExecute) {
    this.execute = callback;
    return this;
  }

  public setAutocomplete(callback: AutocompleteExecute) {
    this.autocomplete = callback;
    return this;
  }
}
