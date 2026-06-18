import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} from "discord.js";

import { InteractionHelper } from "../../utils/interactionHelper.js";
import { handleInteractionError } from "../../utils/errorHandler.js";

const colors = {
    czerwony: 0xff0000,
    zielony: 0x00ff00,
    niebieski: 0x0099ff,
    zolty: 0xffff00,
    fioletowy: 0x9932cc
};

export default {
    data: new SlashCommandBuilder()
        .setName("ogloszenie")
        .setDescription("Wysyła profesjonalne ogłoszenie.")

        .addStringOption(option =>
            option
                .setName("tytul")
                .setDescription("Tytuł ogłoszenia")
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName("tresc")
                .setDescription("Treść ogłoszenia")
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName("kolor")
                .setDescription("Kolor embeda")
                .setRequired(true)
                .addChoices(
                    { name: "🟥 Czerwony", value: "czerwony" },
                    { name: "🟩 Zielony", value: "zielony" },
                    { name: "🟦 Niebieski", value: "niebieski" },
                    { name: "🟨 Żółty", value: "zolty" },
                    { name: "🟪 Fioletowy", value: "fioletowy" }
                ))

        .addChannelOption(option =>
            option
                .setName("kanal")
                .setDescription("Kanał wysłania")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        try {

            const title = interaction.options.getString("tytul");
            const description = interaction.options.getString("tresc");
            const color = interaction.options.getString("kolor");
            const channel = interaction.options.getChannel("kanal");

            const embed = new EmbedBuilder()
                .setColor(colors[color])
                .setTitle(`📢 ${title}`)
                .setDescription(description)
                .addFields(
                    {
                        name: "Autor",
                        value: interaction.user.toString(),
                        inline: true
                    },
                    {
                        name: "Data",
                        value: `<t:${Math.floor(Date.now()/1000)}:F>`,
                        inline: true
                    }
                )
                .setFooter({
                    text: interaction.guild.name
                });

            await channel.send({
                embeds: [embed]
            });

            await InteractionHelper.safeReply(interaction,{
                content:"✅ Ogłoszenie zostało wysłane.",
                ephemeral:true
            });

        } catch(error){

            await handleInteractionError(interaction,error,{
                type:"command",
                commandName:"ogloszenie",
                context:"announcement"
            });

        }

    }

};
