import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import 'dotenv/config';

const axios = require('axios').default;
const BASE_URL = `https://tenor.googleapis.com/v2/search?`
const TENOR_API_KEY = process.env.TENOR_API_KEY;
const CKEY = 'ataibot2';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sends anime gifs')
        .addSubcommand((subcommand) =>
            subcommand.setName('hi').setDescription('Anime hi')
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('hmpf').setDescription('Anime hmpf')
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('sad').setDescription('Anime sad')
        ),
    async execute(interaction: CommandInteraction) {
        const option = interaction.options.getSubcommand() ?? 'anime girl';
        const query = 'anime ' + option

        const axiosGet = async () => {
            try {
                const result = await axios({
                    method: 'get',
                    url: BASE_URL,
                    params: {
                        key: TENOR_API_KEY,
                        client_key: CKEY,
                        random: true,
                        limit: 10,
                        q: query,
                        ar_range: 'standard',
                    }
                });
                return result.data.results;
            } catch (err) {
                console.error(err);
            };
        };

        const result = await axiosGet();

        // console.log(result);
        const ranNum = Math.floor(Math.random() * 10)
        const gifURL = result[ranNum].media_formats.gif.url;

        console.log(gifURL);

        const embedMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            // .setURL(gifURL);
            .setImage(gifURL);

        await interaction.reply({
            embeds: [embedMessage]
        });
    },
};
