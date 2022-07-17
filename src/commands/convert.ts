import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

const axios = require('axios').default;
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    // $1 = 1,300 won

    data : new SlashCommandBuilder()
        .setName('converter')
        .setDescription('It converts')
        .addNumberOption(option =>
            option.setName('num')
                .setDescription('krw to usd')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) { 
        const KRW = interaction.options.getNumber('num') ?? 0;

        const requestURL = 'https://api.exchangerate.host/convert?from=KRW&to=USD';

        const axiosGet = axios.get(requestURL)
        .then((res: any | undefined) => {
            const rate = res.data.info.rate;
            const USD = KRW * rate;
            const roundUSD = Math.round(USD * 100) / 100;
           
            return roundUSD;
        })
        .catch((err: Error) => {
            console.error(err);
        });
        
        const USD:number = await axiosGet;

        const strKRW = KRW.toLocaleString("en-US");
        const strUSD = USD.toLocaleString("en-US");

        await interaction.deferReply();
        await wait(2000);
        await interaction.editReply({
            content : `￦${strKRW} = $${strUSD}`
        });
        
    }
}


        
