import Discord from "discord.js";
import Command from "../classes/Command";
import { fetchPlanningSenart } from "../utils/fetchPlanning";
import makeCanvas from "../utils/makeCanvas";

export default new Command()
  .setData((slash) =>
    slash.setName("planning").setDescription("Pour avoir l'emploi du temps")
  )
  .setExecute(async (client, slash) => {
    await slash.deferReply({ ephemeral: true });

    const planning = await fetchPlanningSenart();
    const canvas = makeCanvas(planning);

    return slash.editReply({
      files: [
        new Discord.AttachmentBuilder(canvas.toBuffer("image/png"), {
          name: "planning.png",
        }),
      ],
    });
  });
