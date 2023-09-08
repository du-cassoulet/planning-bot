import Discord from "discord.js";
import Command from "./Command";
import fs from "fs";
import path from "path";
import Event from "./Event";

export default class Client extends Discord.Client {
  public commands: Discord.Collection<string, Command>;

  constructor() {
    const intents = [
      Discord.IntentsBitField.Flags.Guilds,
      Discord.IntentsBitField.Flags.GuildMessages,
      Discord.IntentsBitField.Flags.GuildMembers,
    ];

    super({ intents });

    this.commands = new Discord.Collection();
  }

  private fetchCommands(root = path.join(__dirname, "../commands")) {
    const dirs = fs.readdirSync(root);

    dirs.forEach((dir) => {
      const dirPath = path.join(root, dir);

      if (fs.lstatSync(dirPath).isDirectory()) {
        return this.fetchCommands(dirPath);
      } else {
        const command: Command = require(dirPath).default;
        if (!command.data) return;

        return this.commands.set(command.data.name, command);
      }
    });
  }

  private fetchEvents(root = path.join(__dirname, "../events")) {
    const dirs = fs.readdirSync(root);

    dirs.forEach((dir) => {
      const dirPath = path.join(root, dir);

      if (fs.lstatSync(dirPath).isDirectory()) {
        return this.fetchCommands(dirPath);
      } else {
        const event: Event = require(dirPath).default;

        return this.on(<keyof Discord.ClientEvents>event.eventName, (...args) =>
          event.execute(this, ...args)
        );
      }
    });
  }

  public start(token?: string) {
    this.fetchEvents();
    this.fetchCommands();

    this.login(token);
  }
}
