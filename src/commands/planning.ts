import Discord from "discord.js";
import Command from "../classes/Command";
import fetchPlanning from "../utils/fetchPlanning";
import makeCanvas from "../utils/makeCanvas";

const Groups: { [key: string]: [number, number] } = Object.freeze({
  INFO: [6, 14],
});

export default new Command()
  .setData((slash) =>
    slash.setName("planning").setDescription("Pour avoir l'emploi du temps")
  )
  .setExecute(async (client, slash) => {
    await slash.deferReply({ ephemeral: true });

    const planning = await fetchPlanning(...Groups.INFO_1);
    const canvas = makeCanvas(planning);

    return slash.editReply({
      files: [
        new Discord.AttachmentBuilder(canvas.toBuffer("image/png"), {
          name: "planning.png",
        }),
      ],
    });
  });
