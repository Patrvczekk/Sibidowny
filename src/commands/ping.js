import { SlashCommandBuilder } from "discord.js";
import { successEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";
import { handleInteractionError } from "../../utils/errorHandler.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Sprawdza opóźnienie bota."),

    async execute(interaction) {
        try {
            const ping = interaction.client.ws.ping;

            await InteractionHelper.safeReply(interaction, {
                embeds: [
                    successEmbed(
                        "🏓 Pong!",
                        `Bot działa poprawnie.\n\n**Ping API:** \`${ping} ms\``
                    ),
                ],
            });
        } catch (error) {
            await handleInteractionError(interaction, error, {
                type: "command",
                commandName: "ping",
                context: "ping_command",
            });
        }
    },
};
