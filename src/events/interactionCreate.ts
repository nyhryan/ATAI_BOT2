import { CommandInteraction } from 'discord.js';

module.exports = {
    name: 'interactionCreate',
    execute(interaction: CommandInteraction) {
        if (interaction.channel && interaction.channel.type === 'GUILD_TEXT') {
            console.log(
                `${interaction.user.tag} in [#${interaction.channel.name}] triggered an interaction.`
            );
        }
    },
};
